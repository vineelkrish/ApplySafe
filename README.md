# ApplySafe – Job Posting Safety Detector

**ApplySafe** is a web application designed to help users determine whether a job or internship posting is **genuine or potentially a scam**. It uses basic analysis techniques on job descriptions and contact information to flag suspicious postings. Built using **TypeScript** and **PostgreSQL**, this project was created using AI-assisted **vibe coding** within a day on **Replit**.

---

##  Project Motivation

Fake job postings and scam internships have become increasingly common across platforms like LinkedIn, WhatsApp, Telegram, and unknown job boards. **ApplySafe** was built to address this issue by providing a simple, fast, and user-friendly tool to evaluate the **safety of a job offer before applying**.

---

##  Features

1. Paste or enter job description to evaluate  
2. Flags suspicious words, patterns, or contact methods  
3. Uses PostgreSQL to store and analyze past job inputs  
4. Provides result: **Safe**, **Scam**, or **Needs Review**  
5. AI-assisted vibe-coded logic for red-flag detection  
6. Built in just 1 day as a rapid prototype on Replit

---

##  Tech Stack

-  **Frontend**: TypeScript, HTML, CSS  
-  **Backend**: TypeScript (Node.js environment)  
-  **Database**: PostgreSQL (Replit DB or Cloud PostgreSQL)  
-  **AI Assistance**: ChatGPT + Replit AI for vibe coding  
-  **Platform**: Developed and hosted on **Replit**

---

##  How It Works

1. User submits job description through a form  
2. `scamChecker.ts` analyzes the content using:
   - Blacklisted phrases (e.g., "no interview", "registration fee")  
   - Red-flag contact info (e.g., WhatsApp-only, personal Gmail, etc.)  
   - Grammar issues and urgency terms ("act now", "hiring fast")  
3. Based on score and patterns, the job is labeled:
   - ✅ **Safe**
   - ❌ **Scam**
   - ⚠️ **Unclear – Review Suggested**  
4. The result is shown on the frontend and saved to PostgreSQL for audit/analysis

---

##  Accuracy

-  This is a **prototype**: accuracy is **moderate (~60–70%)**
-  No machine learning or AI model — purely **rule-based**
-  Ideal for small-scale use and awareness, not real-time validation

---

##  Challenges Faced

- Designed and implemented in under 24 hours  
- Balancing detection logic with false positives  
- AI-generated code had to be manually corrected in some places  
- Integrating PostgreSQL within Replit’s environment

---

##  Future Improvements

-  Train a real NLP model on job scam datasets  
-  Add link preview and live scraping for posted URLs  
-  User feedback system to mark jobs as scam or safe  
-  Admin dashboard to monitor and moderate jobs  
-  User accounts to save checks and view history

---
## ⚠️ Disclaimer

This project is built as an experimental tool for **educational and awareness purposes only**. It does **not guarantee 100% accurate classification** of job postings. Please verify job offers independently before applying.
