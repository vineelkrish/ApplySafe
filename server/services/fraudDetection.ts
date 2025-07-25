import { analyzeJobForFraud, type FraudAnalysisResult } from './openai';
import { storage } from '../storage';
import type { InsertJob, Job } from '@shared/schema';

export interface EmailValidationResult {
  isValid: boolean;
  isDomainSuspicious: boolean;
  domain: string;
  warnings: string[];
}

export function validateEmail(email: string): EmailValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  
  if (!isValid) {
    return {
      isValid: false,
      isDomainSuspicious: true,
      domain: '',
      warnings: ['Invalid email format'],
    };
  }
  
  const domain = email.split('@')[1].toLowerCase();
  const suspiciousDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'yandex.com', '163.com', 'qq.com', 'protonmail.com'
  ];
  
  const warnings: string[] = [];
  const isDomainSuspicious = suspiciousDomains.includes(domain);
  
  if (isDomainSuspicious) {
    warnings.push('Uses generic email provider instead of company domain');
  }
  
  return {
    isValid,
    isDomainSuspicious,
    domain,
    warnings,
  };
}

export function extractScamKeywords(text: string): string[] {
  const scamKeywords = [
    'pay for training', 'training fee', 'startup fee', 'registration fee',
    'no experience required', 'earn money fast', 'work from home',
    'guaranteed income', 'make money online', 'be your own boss',
    'unlimited earning potential', 'financial freedom',
    'whatsapp interview', 'telegram contact', 'send money',
    'western union', 'money gram', 'gift cards',
    'mlm', 'multi level marketing', 'pyramid',
    'investment opportunity', 'crypto', 'bitcoin',
    'data entry', 'copy paste', 'simple typing',
    'no interview required', 'immediate start',
    'work part time', 'flexible hours', 'set your own schedule'
  ];
  
  const foundKeywords: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const keyword of scamKeywords) {
    if (lowerText.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }
  
  return foundKeywords;
}

function performPatternBasedAnalysis(
  title: string,
  description: string,
  company?: string,
  contactEmail?: string,
  sourceUrl?: string
): FraudAnalysisResult {
  const combinedText = `${title} ${description} ${company || ''} ${contactEmail || ''} ${sourceUrl || ''}`.toLowerCase();
  
  const scamPatterns = {
    'unrealistic_pay': /(\$\d{3,}.*week|\$\d{4,}.*month|make.*\$\d{3,}|earn.*\$\d{3,})/i,
    'upfront_payment': /(training fee|startup fee|registration fee|pay.*training|send money|western union)/i,
    'no_experience': /(no experience|no skills required|anyone can do|simple work)/i,
    'urgency': /(urgent|immediate|asap|hurry|limited time|act now)/i,
    'work_from_home': /(work from home|remote only|homebased|work anywhere)/i,
    'vague_description': /(data entry|copy paste|simple typing|easy work)/i,
    'unprofessional': /(whatsapp|telegram|gmail\.com|yahoo\.com|hotmail\.com)/i,
    'mlm_language': /(be your own boss|financial freedom|unlimited earning|residual income)/i
  };
  
  const redFlags: string[] = [];
  let riskScore = 0;
  
  for (const [pattern, regex] of Object.entries(scamPatterns)) {
    if (regex.test(combinedText)) {
      riskScore += 15;
      switch (pattern) {
        case 'unrealistic_pay': redFlags.push('Unrealistic salary promises'); break;
        case 'upfront_payment': redFlags.push('Requests upfront payment'); break;
        case 'no_experience': redFlags.push('No experience required for high pay'); break;
        case 'urgency': redFlags.push('Creates false urgency'); break;
        case 'work_from_home': redFlags.push('Work from home emphasis'); break;
        case 'vague_description': redFlags.push('Vague job description'); break;
        case 'unprofessional': redFlags.push('Unprofessional contact method'); break;
        case 'mlm_language': redFlags.push('MLM/pyramid scheme language'); break;
      }
    }
  }
  
  const riskLevel = riskScore > 70 ? 'high' : riskScore > 30 ? 'medium' : 'low';
  
  return {
    riskScore: Math.min(100, riskScore),
    riskLevel,
    redFlags,
    explanation: riskScore > 70 
      ? `High-risk job posting with ${redFlags.length} major red flags. This appears to be a potential scam.`
      : riskScore > 30
      ? `Medium-risk job posting with some concerning elements. Exercise caution.`
      : 'Low-risk job posting with minimal fraud indicators.',
    confidence: 0.85,
    keyPhrases: redFlags.map(flag => flag.toLowerCase())
  };
}

export async function performComprehensiveAnalysis(jobData: InsertJob): Promise<Job> {
  try {
    // 1. AI Analysis with fallback
    let aiAnalysis: FraudAnalysisResult;
    
    try {
      aiAnalysis = await analyzeJobForFraud(
        jobData.title,
        jobData.description,
        jobData.company || undefined,
        jobData.contactEmail || undefined,
        jobData.sourceUrl || undefined
      );
    } catch (openaiError) {
      console.log('OpenAI unavailable, using pattern-based analysis');
      aiAnalysis = performPatternBasedAnalysis(
        jobData.title,
        jobData.description,
        jobData.company,
        jobData.contactEmail,
        jobData.sourceUrl
      );
    }
    
    // 2. Email Validation
    let emailWarnings: string[] = [];
    if (jobData.contactEmail) {
      const emailValidation = validateEmail(jobData.contactEmail);
      if (emailValidation.isDomainSuspicious) {
        emailWarnings = emailValidation.warnings;
      }
    }
    
    // 3. Keyword Analysis
    const scamKeywords = extractScamKeywords(jobData.description);
    
    // 4. Company Verification
    let companyTrustScore = 0;
    if (jobData.company) {
      const existingCompany = await storage.getCompanyByName(jobData.company);
      if (existingCompany) {
        companyTrustScore = existingCompany.trustScore || 0;
      }
    }
    
    // 5. Combine all red flags
    const allRedFlags = [
      ...aiAnalysis.redFlags,
      ...emailWarnings,
      ...scamKeywords.map(keyword => `Contains suspicious phrase: "${keyword}"`)
    ];
    
    // 6. Calculate final risk score
    let finalRiskScore = aiAnalysis.riskScore;
    
    // Adjust based on email validation
    if (emailWarnings.length > 0) {
      finalRiskScore += 15;
    }
    
    // Adjust based on keyword count
    finalRiskScore += scamKeywords.length * 5;
    
    // Adjust based on company trust score
    if (companyTrustScore > 0) {
      finalRiskScore -= companyTrustScore * 10;
    }
    
    // Cap at 100
    finalRiskScore = Math.min(100, finalRiskScore);
    
    // Determine final risk level and status
    let riskLevel: string;
    let status: string;
    
    if (finalRiskScore >= 80) {
      riskLevel = 'high';
      status = 'scam';
    } else if (finalRiskScore >= 50) {
      riskLevel = 'medium';
      status = 'suspicious';
    } else if (finalRiskScore >= 20) {
      riskLevel = 'low';
      status = 'safe';
    } else {
      riskLevel = 'low';
      status = 'safe';
    }
    
    // Create job with analysis results
    const jobWithAnalysis = {
      ...jobData,
      riskScore: finalRiskScore,
      riskLevel,
      status,
      redFlags: allRedFlags,
      aiAnalysis: {
        explanation: aiAnalysis.explanation,
        confidence: aiAnalysis.confidence,
        keyPhrases: [...aiAnalysis.keyPhrases, ...scamKeywords],
      },
    };
    
    return await storage.createJob(jobWithAnalysis);
  } catch (error) {
    console.error('Comprehensive analysis failed:', error);
    throw new Error('Failed to perform job analysis');
  }
}
