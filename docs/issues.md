# Issue Tracker & Technical Debt

This document tracks current issues, technical debt, pending features, and integration tasks to ensure a smooth transition towards a production-ready AI Learning Platform.

## 1. Frontend Refactor & Stabilization (COMPLETED)
*   [x] **Architecture Stabilization**: Feature-driven structure implemented.
*   [x] **Design System Implementation**: Centralized UI library created in `src/components/ui`.
*   [x] **Dashboard Modernization**: Replaced legacy components with new Metric Cards, Quick Actions, and Activity feeds.
*   [x] **Global Layout System**: Unified `DashboardLayout` for all protected routes.
*   [x] **Page Refactoring**: All main pages (Learning, Assistant, Notes, History, Profile, Auth) migrated to new architecture.
*   [x] **Full Audit & Cleanup**: Removed legacy components, duplicate files, and dead code.

## 2. Workspace & Core Features (PENDING)
*   [x] **Workspace Tabs UI**: Create tab layout for Content, AI Chat, AI Action, Flashcard, Quiz, and Quiz Result. (COMPLETED)
*   [ ] **Document Parsing Pipeline**: Backend service to receive file upload (PDF/Text) and extract text.
*   [ ] **Context Building Service**: Logic for chunking large documents for Gemini prompt context.
*   [ ] **Save-to-Notes Flow**: Implementation of UX flow where AI output can be saved as a Note with one click.
*   [ ] **Soft History Implementation**: Activity logging that persists even if reference files are deleted.

## 3. Backend & Integration
*   [ ] **Database Schema Implementation**: Create migrations/schemas (MongoDB/PostgreSQL) for `workspaces`, `documents`, `ai_conversations`, etc.
*   [ ] **Auth System Integration**: Connect frontend with secure JWT-based backend authentication.
*   [ ] **AI Integration (Gemini)**: Implement service for Chat, Summary, Flashcard, and Quiz generation.

## 4. Technical Debt & Future Improvements
*   [ ] **TypeScript Migration**: Gradually transition to TypeScript for better type safety, especially for AI responses.
*   [ ] **Centralized State (Zustand)**: Move local workspace/notes state to a global store for consistency.
*   [ ] **Unit & Integration Testing**: Implement testing for core AI services and UI components.
*   [ ] **Security Audit**: Sanitize AI inputs, validate file uploads, and implement rate-limiting for AI endpoints.

## 5. Recently Completed Cleanup (Audit May 2026)
*   Removed legacy `src/components/dashboard/learning` duplicate components.
*   Removed legacy `src/components/dashboard/overview` components.
*   Cleaned up unused layout files and consolidated UI library.
*   Standardized naming conventions across all features.
