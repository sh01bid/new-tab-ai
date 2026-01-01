# New Tab AI - Project Handover & Guide

This document summarizes the architectural decisions, technology stack, and implementation plan for the **New Tab AI** Chrome Extension monorepo. Use this as the `README.md` or central documentation in your new workspace.

## 🚀 Project Overview

**Goal**: Create a premium Chrome Extension that overrides the default New Tab page with a customizable, AI-powered dashboard.
**Key Features**:
- **AI Chat**: Glassmorphism UI, streaming responses, Markdown support.
- **Hybrid AI Engine**: Supports both "Bring Your Own Key" (Client-side) and "Cloud Mode" (Server-side proxy).
- **Search & Shortcuts**: Integrated search bar (Google/Bing/etc.) and customizable speed dial.
- **China Friendly**: Optimized for deployment on HK/CN servers with direct connectivity.

## 🛠️ Technology Stack

| Component | Tech Choice | Reason |
|-----------|-------------|--------|
| **Monorepo** | **Turborepo** + **PNPM** | Efficient management of shared types and multiple packages. |
| **Extension** | **React** + **Vite** + **Tailwind CSS** | Fast build (MV3 compliant), modern styling, high performance. |
| **Backend/Web**| **Next.js** (App Router) | Unified "3-in-1" solution: API (tRPC), Dashboard, and Landing Page. |
| **Database** | **PostgreSQL** + **Drizzle ORM** | Reliable SQL storage with type-safe ORM. |
| **API Layer** | **tRPC** | End-to-end type safety between Extension and Backend. |
| **Styling** | **Tailwind CSS v3** | Rapid UI development, consistent theming. |

## 📂 Directory Structure

```bash
new-tab-ai/
├── package.json           # Root configuration
├── pnpm-workspace.yaml    # Workspace definition
├── turbo.json            # Build pipeline config
└── packages/
    ├── extension/         # Chrome Extension (Vite + React)
    │   ├── src/background # Service Workers
    │   ├── src/content    # Content Scripts
    │   └── src/newtab     # UI Features (Chat, Search)
    │
    ├── web/               # Backend & Dashboard (Next.js)
    │   ├── src/app/api    # tRPC Routers & Edge Functions
    │   ├── src/app/dashboard # User Management UI
    │   └── src/db         # Drizzle Schema
    │
    └── shared/            # Shared Library
        ├── src/types      # Zod Schemas & TypeScript Interfaces
        └── src/constants  # Shared configuration
```

## ⚡ Getting Started

1.  **Install Dependencies**
    ```bash
    pnpm install
    ```

2.  **Start Development Server**
    This will launch both the Extension (watch mode) and the Web Dashboard/Backend.
    ```bash
    pnpm dev
    ```

3.  **Load Extension in Chrome**
    - Go to `chrome://extensions/`
    - Enable **Developer Mode**.
    - Click **Load unpacked**.
    - Select `packages/extension/dist`.

## 🛣️ Implementation Roadmap

### Phase 1: Foundation (✅ Completed)
- [x] Monorepo Structure Setup
- [x] Shared TypeScript Configuration
- [x] Basic Package Scaffolding (Extension, Web, Shared)
- [x] Tailwind CSS Integration

### Phase 2: Core Features (🚧 Next Steps)
- [ ] **Data Layer**: Configure Drizzle ORM & PostgreSQL connection.
- [ ] **Auth**: Implement user authentication (NextAuth.js or custom JWT for Extension).
- [ ] **tRPC Setup**: Connect Extension to Next.js API via tRPC.
- [ ] **UI Components**: Build SearchBar, ShortcutsGrid, and ChatWindow.

### Phase 3: AI & Advanced
- [ ] **AI Integration**: OpenAI/Gemini stream handling.
- [ ] **Context Awareness**: "Chat with Page" functionality.
- [ ] **Payment**: Subscription integration (Stripe/WeChat Pay).

## 💡 Key Architecture Decisions

### Why Next.js instead of Express?
We chose Next.js to combine the **API Server**, **User Dashboard**, and **Marketing Site** into a single deployable unit. This simplifies deployment (single Docker container) and ensures type safety across the entire "Web" domain.

### China Accessibility Strategy
- **Deployment**: The Next.js container should be deployed to a **Hong Kong** or **Tokyo** server (e.g., AliCloud HK).
- **Connectivity**: This ensures low latency (<50ms) for mainland China users while maintaining unrestricted access to Global AI APIs (OpenAI, Google) via the backend proxy.

### Why tRPC?
To prevent API mismatch bugs. The Extension imports type definitions directly from the Backend. If the Backend API changes, the Extension build will fail immediately, enforcing synchronization.
