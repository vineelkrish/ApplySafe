import { createWorker } from 'tesseract.js';
import { analyzeJobForFraud, type FraudAnalysisResult } from './openai';

export async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
  const worker = await createWorker('eng');
  
  try {
    const { data: { text } } = await worker.recognize(imageBuffer);
    return text.trim();
  } catch (error) {
    console.error('OCR extraction failed:', error);
    throw new Error('Failed to extract text from image');
  } finally {
    await worker.terminate();
  }
}

export async function analyzeJobPosterImage(imageBuffer: Buffer): Promise<{
  extractedText: string;
  fraudAnalysis: FraudAnalysisResult;
}> {
  try {
    // Extract text using OCR
    const extractedText = await extractTextFromImage(imageBuffer);
    
    if (!extractedText || extractedText.length < 10) {
      throw new Error('Unable to extract sufficient text from image');
    }
    
    // Analyze extracted text for fraud
    const fraudAnalysis = await analyzeJobForFraud(
      'Job Poster Analysis',
      extractedText
    );
    
    return {
      extractedText,
      fraudAnalysis,
    };
  } catch (error) {
    console.error('Job poster analysis failed:', error);
    throw new Error('Failed to analyze job poster image');
  }
}
