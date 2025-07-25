import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import { storage } from "./storage";
import { performComprehensiveAnalysis } from "./services/fraudDetection";
import { analyzeJobPosterImage } from "./services/ocr";
import { analyzeImageForJobFraud } from "./services/openai";
import { insertJobSchema, insertFeedbackSchema, insertScamReportSchema } from "@shared/schema";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });
  
  // Broadcast function for real-time updates
  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Analytics endpoint
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Job analysis endpoint
  app.post("/api/jobs/analyze", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const analyzedJob = await performComprehensiveAnalysis(jobData);
      
      // Broadcast real-time update
      broadcast({
        type: 'job_analyzed',
        job: analyzedJob,
      });
      
      res.json(analyzedJob);
    } catch (error) {
      console.error("Job analysis error:", error);
      res.status(500).json({ error: "Failed to analyze job posting" });
    }
  });

  // Image analysis endpoint
  app.post("/api/jobs/analyze-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Check if it's an image
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: "File must be an image" });
      }

      let result;
      
      // For images, we can use both OCR and direct image analysis
      if (req.file.mimetype.includes('jpeg') || req.file.mimetype.includes('png')) {
        // Try OCR first
        try {
          result = await analyzeJobPosterImage(req.file.buffer);
        } catch (ocrError) {
          // Fallback to direct image analysis
          const base64Image = req.file.buffer.toString('base64');
          const fraudAnalysis = await analyzeImageForJobFraud(base64Image);
          result = {
            extractedText: 'Text extraction failed, analyzed image directly',
            fraudAnalysis,
          };
        }
      } else {
        return res.status(400).json({ error: "Unsupported image format" });
      }

      res.json(result);
    } catch (error) {
      console.error("Image analysis error:", error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  // Get jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      const { userId, limit } = req.query;
      const jobs = await storage.getJobs(
        userId as string, 
        limit ? parseInt(limit as string) : undefined
      );
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  // Get specific job
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  // Feedback endpoints
  app.post("/api/feedback", async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(feedbackData);
      
      broadcast({
        type: 'feedback_created',
        feedback,
      });
      
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: "Failed to create feedback" });
    }
  });

  app.get("/api/feedback/:jobId", async (req, res) => {
    try {
      const feedback = await storage.getFeedback(req.params.jobId);
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  // Scam reports
  app.post("/api/scam-reports", async (req, res) => {
    try {
      const reportData = insertScamReportSchema.parse(req.body);
      const report = await storage.createScamReport(reportData);
      
      broadcast({
        type: 'scam_report_created',
        report,
      });
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to create scam report" });
    }
  });

  app.get("/api/scam-reports", async (req, res) => {
    try {
      const { status } = req.query;
      const reports = await storage.getScamReports(status as string);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scam reports" });
    }
  });

  // Alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const { resolved } = req.query;
      const alerts = await storage.getAlerts(
        resolved !== undefined ? resolved === 'true' : undefined
      );
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.patch("/api/alerts/:id", async (req, res) => {
    try {
      const { resolved } = req.body;
      const alert = await storage.updateAlert(req.params.id, { resolved });
      
      broadcast({
        type: 'alert_updated',
        alert,
      });
      
      res.json(alert);
    } catch (error) {
      res.status(500).json({ error: "Failed to update alert" });
    }
  });

  // Trend statistics
  app.get("/api/trends", async (req, res) => {
    try {
      const { days } = req.query;
      const trends = await storage.getTrendStats(
        days ? parseInt(days as string) : undefined
      );
      res.json(trends);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trend statistics" });
    }
  });

  // Companies
  app.get("/api/companies/:name", async (req, res) => {
    try {
      const company = await storage.getCompanyByName(req.params.name);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  return httpServer;
}
