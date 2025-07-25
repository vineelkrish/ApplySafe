# ApplySafe - AI-Powered Job Fraud Detection System

## Overview

ApplySafe is a full-stack web application designed to protect job seekers from employment fraud through AI-powered analysis. The system uses advanced machine learning algorithms to analyze job postings, verify company legitimacy, and provide real-time scam detection with community-driven verification features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme optimizations
- **State Management**: TanStack Query for server state and form handling with React Hook Form
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **API Pattern**: RESTful API with WebSocket support for real-time features
- **File Upload**: Multer for handling image/document uploads

### Key Components

#### AI-Powered Fraud Detection
- **OpenAI Integration**: GPT-4o model for intelligent job posting analysis
- **OCR Processing**: Tesseract.js for extracting text from job poster images
- **Risk Assessment**: Multi-factor scoring system (0-100) with risk level categorization
- **Pattern Recognition**: Keyword detection for common scam indicators

#### Real-time Communication
- **WebSocket Server**: Real-time alerts and notifications
- **Live Updates**: Instant fraud detection results and security alerts

#### Data Analysis & Reporting
- **Analytics Dashboard**: Comprehensive fraud statistics and trends
- **Community Features**: User feedback and verification system
- **Admin Panel**: Content moderation and system management

## Data Flow

1. **Job Analysis Pipeline**:
   - User submits job posting details or uploads job poster image
   - OCR extracts text from images (if applicable)
   - AI analyzes content for fraud indicators using OpenAI API
   - System calculates risk score and categorizes threat level
   - Results stored in database and returned to user

2. **Real-time Notifications**:
   - WebSocket broadcasts critical alerts to connected clients
   - Users receive instant notifications for high-risk detections
   - Admin receives alerts for system events and reports

3. **Community Verification**:
   - Users provide feedback on job postings
   - Community reports contribute to company trust scores
   - Admin moderation ensures data quality

## External Dependencies

### Core Services
- **OpenAI API**: Primary AI service for fraud detection analysis
- **Neon Database**: Serverless PostgreSQL hosting
- **WebSocket**: Real-time communication protocol

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Fast JavaScript bundling for production
- **TSX**: TypeScript execution for development

### UI Components
- **Radix UI**: Accessible, unstyled UI primitives
- **Lucide React**: Icon library for consistent iconography
- **TanStack Query**: Server state management and caching

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **Database**: Neon development database with connection pooling
- **Environment Variables**: Secure API key management

### Production Build
- **Frontend**: Static assets built with Vite and served by Express
- **Backend**: Bundled with ESBuild for optimal performance
- **Database**: Production Neon database with connection pooling
- **Process Management**: Single Node.js process serving both frontend and API

### Environment Configuration
- **Development**: `npm run dev` - TypeScript execution with hot reload
- **Production**: `npm run build && npm start` - Optimized bundle execution
- **Database**: `npm run db:push` - Schema synchronization with Drizzle

### Security Considerations
- **API Keys**: Environment variable protection for OpenAI and database credentials
- **Input Validation**: Zod schema validation for all user inputs
- **File Upload**: Size limits and type validation for image uploads
- **Database**: Parameterized queries through Drizzle ORM prevent SQL injection

The application follows a monorepo structure with shared TypeScript types and utilities, ensuring consistency between frontend and backend while maintaining type safety throughout the entire stack.