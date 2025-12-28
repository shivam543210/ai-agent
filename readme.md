# AI Job Agent (Monorepo)

A powerful, agentic AI job search and application assistant.

## 📂 Structure
This project follows a monorepo structure:
-   **`backend/`**: Express.js, Puppeteer, AI Agents.
-   **`client/`**: React, Vite, Tailwind CSS.

## 🚀 Getting Started

### Prerequisites
-   Node.js v18+
-   npm

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*Runs on http://localhost:8000*

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*Runs on http://localhost:9000*

## 🛠️ Features
-   **Agentic Search**: Uses APIs (JSearch) instead of scraping.
-   **Intelligent Ranking**: Scores jobs based on user profile.
-   **Safe Apply**: Queue-based application system.
-   **Headless Browsing**: Puppeteer fallback for complex sites.

## 📝 Documentation
See `history.md` for detailed architectural changes and `project_documentation.md` for prompts/logic.
