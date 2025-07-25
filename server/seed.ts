import { storage } from "./storage";
import type { InsertUser, InsertJob, InsertCompany, InsertAlert } from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Create sample users
    const adminUser: InsertUser = {
      username: "admin",
      email: "admin@applysafe.com",
      password: "hashed_password", // In real app, this would be properly hashed
      role: "admin",
    };

    const regularUser: InsertUser = {
      username: "john_doe",
      email: "john@example.com", 
      password: "hashed_password",
      role: "user",
    };

    const admin = await storage.createUser(adminUser);
    const user = await storage.createUser(regularUser);

    // Create sample companies
    const companies = [
      {
        name: "TechCorp Inc",
        domain: "techcorp.com",
        verified: true,
        trustScore: 85,
        legitimateReports: 150,
        scamReports: 0,
      },
      {
        name: "QuickCash Solutions",
        domain: "quickcash.biz",
        verified: false,
        trustScore: 15,
        legitimateReports: 2,
        scamReports: 47,
      },
    ];

    const createdCompanies = await Promise.all(
      companies.map(company => storage.createCompany(company))
    );

    // Create sample jobs with analysis results
    const jobs: InsertJob[] = [
      {
        title: "Senior Software Engineer",
        company: "TechCorp Inc",
        description: "We are looking for an experienced software engineer to join our team. Requirements: 5+ years of experience, knowledge of React, Node.js, and PostgreSQL. Competitive salary and benefits package included.",
        contactEmail: "hr@techcorp.com",
        sourceUrl: "https://techcorp.com/careers",
        userId: user.id,
      },
      {
        title: "Data Entry Specialist - $5000/week",
        company: "QuickCash Solutions", 
        description: "URGENT! Make $5000 per week working from home! No experience required! Just copy and paste simple data. Pay $200 training fee to get started. WhatsApp us for immediate interview!",
        contactEmail: "jobs@quickcash.biz",
        sourceUrl: "https://quickcash.biz/jobs",
        userId: user.id,
      },
      {
        title: "Marketing Manager",
        company: "Digital Innovations LLC",
        description: "Looking for a creative marketing manager to lead our digital campaigns. Must have 3+ years experience in digital marketing, social media management, and analytics.",
        contactEmail: "careers@digitalinnovations.com",
        sourceUrl: "https://digitalinnovations.com/careers",
        userId: user.id,
      },
    ];

    for (const jobData of jobs) {
      // Simulate AI analysis results based on job content
      let riskScore = 5;
      let riskLevel = "low";
      let status = "safe";
      let redFlags: string[] = [];

      if (jobData.description.toLowerCase().includes("$5000/week") || 
          jobData.description.toLowerCase().includes("pay") ||
          jobData.description.toLowerCase().includes("whatsapp")) {
        riskScore = 95;
        riskLevel = "high";
        status = "scam";
        redFlags = [
          "Unrealistic salary promises",
          "Upfront payment required",
          "Unprofessional contact method (WhatsApp)",
          "No experience required for high pay",
          "Urgent hiring pressure"
        ];
      }

      const jobWithAnalysis = {
        ...jobData,
        riskScore,
        riskLevel,
        status,
        redFlags,
        aiAnalysis: {
          explanation: riskScore > 80 
            ? "This job posting exhibits multiple red flags typical of employment scams, including unrealistic salary promises and upfront payment requirements."
            : "This appears to be a legitimate job posting with standard requirements and professional presentation.",
          confidence: 0.95,
          keyPhrases: riskScore > 80 
            ? ["$5000/week", "no experience required", "pay training fee", "WhatsApp interview"]
            : ["competitive salary", "experienced", "requirements"]
        }
      };

      await storage.createJob(jobWithAnalysis);
    }

    // Create sample alerts
    const alerts = [
      {
        title: "New MLM Scheme Detected",
        description: "Our AI has identified a new multi-level marketing scheme targeting remote workers with promises of financial freedom.",
        severity: "critical",
        category: "threat_detection",
      },
      {
        title: "System Update Completed",
        description: "Detection algorithms have been updated with the latest fraud patterns. Accuracy improved by 2.1%.",
        severity: "info", 
        category: "system_update",
      },
      {
        title: "Domain Blacklist Updated",
        description: "147 new suspicious domains have been added to our blocklist based on recent fraud reports.",
        severity: "warning",
        category: "threat_detection",
      },
    ] as InsertAlert[];

    await Promise.all(alerts.map(alert => storage.createAlert(alert)));

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}

// Only run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}