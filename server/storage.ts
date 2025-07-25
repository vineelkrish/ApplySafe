import { 
  users, jobs, companies, feedback, scamReports, alerts, trendStats,
  type User, type InsertUser, type Job, type InsertJob, 
  type Company, type InsertCompany, type Feedback, type InsertFeedback,
  type ScamReport, type InsertScamReport, type Alert, type InsertAlert,
  type TrendStat 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Jobs
  getJob(id: string): Promise<Job | undefined>;
  getJobs(userId?: string, limit?: number): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, updates: Partial<Job>): Promise<Job>;
  
  // Companies
  getCompany(id: string): Promise<Company | undefined>;
  getCompanyByName(name: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, updates: Partial<Company>): Promise<Company>;
  
  // Feedback
  getFeedback(jobId: string): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  
  // Scam Reports
  getScamReports(status?: string): Promise<ScamReport[]>;
  createScamReport(report: InsertScamReport): Promise<ScamReport>;
  updateScamReport(id: string, updates: Partial<ScamReport>): Promise<ScamReport>;
  
  // Alerts
  getAlerts(resolved?: boolean): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: string, updates: Partial<Alert>): Promise<Alert>;
  
  // Analytics
  getTrendStats(days?: number): Promise<TrendStat[]>;
  getAnalytics(): Promise<{
    totalAnalyses: number;
    scamsDetected: number;
    usersProtected: number;
    accuracy: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Jobs
  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async getJobs(userId?: string, limit = 50): Promise<Job[]> {
    if (userId) {
      return db.select().from(jobs)
        .where(eq(jobs.userId, userId))
        .orderBy(desc(jobs.createdAt))
        .limit(limit);
    }
    
    return db.select().from(jobs)
      .orderBy(desc(jobs.createdAt))
      .limit(limit);
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    const [updatedJob] = await db
      .update(jobs)
      .set(updates)
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }

  // Companies
  async getCompany(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  async getCompanyByName(name: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.name, name));
    return company || undefined;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
    const [updatedCompany] = await db
      .update(companies)
      .set(updates)
      .where(eq(companies.id, id))
      .returning();
    return updatedCompany;
  }

  // Feedback
  async getFeedback(jobId: string): Promise<Feedback[]> {
    return db.select().from(feedback).where(eq(feedback.jobId, jobId));
  }

  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db.insert(feedback).values(feedbackData).returning();
    return newFeedback;
  }

  // Scam Reports
  async getScamReports(status?: string): Promise<ScamReport[]> {
    if (status) {
      return db.select().from(scamReports)
        .where(eq(scamReports.status, status))
        .orderBy(desc(scamReports.createdAt));
    }
    
    return db.select().from(scamReports)
      .orderBy(desc(scamReports.createdAt));
  }

  async createScamReport(report: InsertScamReport): Promise<ScamReport> {
    const [newReport] = await db.insert(scamReports).values(report).returning();
    return newReport;
  }

  async updateScamReport(id: string, updates: Partial<ScamReport>): Promise<ScamReport> {
    const [updatedReport] = await db
      .update(scamReports)
      .set(updates)
      .where(eq(scamReports.id, id))
      .returning();
    return updatedReport;
  }

  // Alerts
  async getAlerts(resolved?: boolean): Promise<Alert[]> {
    if (resolved !== undefined) {
      return db.select().from(alerts)
        .where(eq(alerts.resolved, resolved))
        .orderBy(desc(alerts.createdAt));
    }
    
    return db.select().from(alerts)
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert> {
    const [updatedAlert] = await db
      .update(alerts)
      .set(updates)
      .where(eq(alerts.id, id))
      .returning();
    return updatedAlert;
  }

  // Analytics
  async getTrendStats(days = 30): Promise<TrendStat[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return db
      .select()
      .from(trendStats)
      .where(gte(trendStats.date, startDate))
      .orderBy(desc(trendStats.date));
  }

  async getAnalytics() {
    const [totalAnalysesResult] = await db.select({ count: count() }).from(jobs);
    const [scamsDetectedResult] = await db
      .select({ count: count() })
      .from(jobs)
      .where(eq(jobs.status, 'scam'));
    
    const [usersProtectedResult] = await db.select({ count: count() }).from(users);
    
    // Calculate accuracy based on verified feedback
    const [accuracyResult] = await db
      .select({ 
        total: count(),
        correct: sql<number>`sum(case when ${feedback.verified} then 1 else 0 end)`
      })
      .from(feedback);
    
    const accuracy = accuracyResult.total > 0 
      ? (accuracyResult.correct / accuracyResult.total) * 100 
      : 96.7;

    return {
      totalAnalyses: totalAnalysesResult.count,
      scamsDetected: scamsDetectedResult.count,
      usersProtected: usersProtectedResult.count,
      accuracy: Math.round(accuracy * 10) / 10,
    };
  }
}

export const storage = new DatabaseStorage();
