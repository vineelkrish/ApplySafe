import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR 
});

export interface FraudAnalysisResult {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  redFlags: string[];
  explanation: string;
  confidence: number;
  keyPhrases: string[];
}

export async function analyzeJobForFraud(
  title: string,
  description: string,
  company?: string,
  contactEmail?: string,
  sourceUrl?: string
): Promise<FraudAnalysisResult> {
  try {
    const prompt = `Analyze this job posting for potential fraud indicators. Consider:
    
Job Title: ${title}
Company: ${company || 'Not provided'}
Description: ${description}
Contact Email: ${contactEmail || 'Not provided'}
Source URL: ${sourceUrl || 'Not provided'}

Evaluate for common scam patterns including:
- Upfront payment requirements
- Unrealistic salary promises
- Vague job descriptions
- Poor grammar/spelling
- Generic email domains
- MLM/pyramid scheme language
- Work-from-home scams
- Identity theft attempts
- Phishing indicators

Provide your analysis in JSON format with:
- riskScore (0-100)
- riskLevel ('low', 'medium', 'high')
- redFlags (array of specific warning signs found)
- explanation (detailed reasoning)
- confidence (0-1)
- keyPhrases (suspicious phrases detected)`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert fraud detection specialist analyzing job postings for scam indicators. Be thorough and specific in your analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and normalize the response
    return {
      riskScore: Math.min(100, Math.max(0, result.riskScore || 0)),
      riskLevel: ['low', 'medium', 'high'].includes(result.riskLevel) 
        ? result.riskLevel 
        : result.riskScore > 70 ? 'high' : result.riskScore > 30 ? 'medium' : 'low',
      redFlags: Array.isArray(result.redFlags) ? result.redFlags : [],
      explanation: result.explanation || 'Analysis completed',
      confidence: Math.min(1, Math.max(0, result.confidence || 0.5)),
      keyPhrases: Array.isArray(result.keyPhrases) ? result.keyPhrases : [],
    };
  } catch (error) {
    console.error('OpenAI analysis failed:', error);
    throw new Error('Failed to analyze job posting for fraud indicators');
  }
}

export async function analyzeImageForJobFraud(base64Image: string): Promise<FraudAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this job posting image for fraud indicators. Look for:
              - Unprofessional formatting
              - Spelling/grammar errors
              - Unrealistic promises
              - Request for upfront payments
              - Generic contact information
              - MLM/pyramid scheme language
              
              Respond in JSON format with riskScore (0-100), riskLevel, redFlags array, explanation, confidence, and keyPhrases.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      riskScore: Math.min(100, Math.max(0, result.riskScore || 0)),
      riskLevel: ['low', 'medium', 'high'].includes(result.riskLevel) 
        ? result.riskLevel 
        : result.riskScore > 70 ? 'high' : result.riskScore > 30 ? 'medium' : 'low',
      redFlags: Array.isArray(result.redFlags) ? result.redFlags : [],
      explanation: result.explanation || 'Image analysis completed',
      confidence: Math.min(1, Math.max(0, result.confidence || 0.5)),
      keyPhrases: Array.isArray(result.keyPhrases) ? result.keyPhrases : [],
    };
  } catch (error) {
    console.error('OpenAI image analysis failed:', error);
    throw new Error('Failed to analyze job posting image');
  }
}
