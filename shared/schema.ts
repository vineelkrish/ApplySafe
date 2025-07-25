import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // user, admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  company: text("company"),
  description: text("description").notNull(),
  contactEmail: text("contact_email"),
  sourceUrl: text("source_url"),
  userId: varchar("user_id").references(() => users.id),
  riskScore: real("risk_score").notNull().default(0),
  riskLevel: text("risk_level").notNull().default("unknown"), // low, medium, high, unknown
  redFlags: jsonb("red_flags").$type<string[]>().default([]),
  aiAnalysis: jsonb("ai_analysis").$type<{
    explanation: string;
    confidence: number;
    keyPhrases: string[];
  }>(),
  status: text("status").notNull().default("pending"), // pending, safe, suspicious, scam
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  domain: text("domain"),
  verified: boolean("verified").default(false),
  trustScore: real("trust_score").default(0),
  scamReports: integer("scam_reports").default(0),
  legitimateReports: integer("legitimate_reports").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => jobs.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rating: text("rating").notNull(), // trust, scam, suspicious
  comment: text("comment"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scamReports = pgTable("scam_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => jobs.id),
  reportedBy: varchar("reported_by").references(() => users.id).notNull(),
  category: text("category").notNull(), // payment_required, identity_theft, mlm, fake_company, phishing
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, verified, dismissed
  moderatedBy: varchar("moderated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // critical, warning, info
  category: text("category").notNull(), // threat_detection, system_update, security_breach
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trendStats = pgTable("trend_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  totalAnalyses: integer("total_analyses").default(0),
  scamsDetected: integer("scams_detected").default(0),
  topScamCategory: text("top_scam_category"),
  averageRiskScore: real("average_risk_score"),
  geographicData: jsonb("geographic_data").$type<Record<string, number>>(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  jobs: many(jobs),
  feedback: many(feedback),
  scamReports: many(scamReports),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  user: one(users, {
    fields: [jobs.userId],
    references: [users.id],
  }),
  feedback: many(feedback),
  scamReports: many(scamReports),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  jobs: many(jobs),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  job: one(jobs, {
    fields: [feedback.jobId],
    references: [jobs.id],
  }),
  user: one(users, {
    fields: [feedback.userId],
    references: [users.id],
  }),
}));

export const scamReportsRelations = relations(scamReports, ({ one }) => ({
  job: one(jobs, {
    fields: [scamReports.jobId],
    references: [jobs.id],
  }),
  reportedByUser: one(users, {
    fields: [scamReports.reportedBy],
    references: [users.id],
  }),
  moderatedByUser: one(users, {
    fields: [scamReports.moderatedBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  riskScore: true,
  riskLevel: true,
  redFlags: true,
  aiAnalysis: true,
  status: true,
}).extend({
  company: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  sourceUrl: z.string().url().optional().or(z.literal("")),
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  verified: true,
  trustScore: true,
  scamReports: true,
  legitimateReports: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
  verified: true,
});

export const insertScamReportSchema = createInsertSchema(scamReports).omit({
  id: true,
  createdAt: true,
  status: true,
  moderatedBy: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  resolved: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type ScamReport = typeof scamReports.$inferSelect;
export type InsertScamReport = z.infer<typeof insertScamReportSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type TrendStat = typeof trendStats.$inferSelect;
