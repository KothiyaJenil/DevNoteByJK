# DevNotes — Full-Stack Development & Database Architecture Guide

Welcome to the comprehensive, end-to-end development guide for **DevNotes** — a developer knowledge management platform designed to save technical knowledge as **Notes** and assemble existing Notes into sequential **Notes Flows**.

This document covers the complete system architecture: **Frontend (React + TS + Vite)**, **Backend REST API (Node.js + Express)**, and **Database Schema Design (MongoDB / Mongoose & PostgreSQL / Prisma)**.

---

## 1. PRODUCT PARADIGM & SYSTEM ARCHITECTURE

```text
                                FULL-STACK ARCHITECTURE
                                
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │                            FRONTEND (Vite + React)                          │
   │  Dashboard | Notes Editor | Flow Visualizer | Command Palette (Ctrl+K)       │
   └──────────────────────────────────────┬──────────────────────────────────────┘
                                          │
                                     HTTP REST API
                                          │
   ┌──────────────────────────────────────▼──────────────────────────────────────┐
   │                         BACKEND API (Node.js + Express)                      │
   │  Auth Middleware | Notes Controller | Flow Service | Central Error Handler    │
   └──────────────────────────────────────┬──────────────────────────────────────┘
                                          │
                                 Mongoose / Prisma ORM
                                          │
   ┌──────────────────────────────────────▼──────────────────────────────────────┐
   │                          DATABASE (MongoDB / Postgres)                      │
   │  Users Collection | Notes Collection | NotesFlows Collection                │
   └─────────────────────────────────────────────────────────────────────────────┘
```

### Core Knowledge Principles
1. **Note Entity**: Independent technical knowledge object containing title, description, dynamic sections, headings, bullet points, syntax-highlighted code snippets, user tags, and reference links. No forced dropdown categories.
2. **Notes Flow Entity**: Sequenced collection of references to existing Notes (`notes: [{ noteId: ObjectId, order: Number }]`). Modifying a Note updates its content across all connected flows automatically without data duplication.

---

## 2. DATABASE DESIGN & SCHEMAS

### 2.1 Entity-Relationship Diagram (ERD)

```text
  ┌───────────────────────────┐         1 : N         ┌───────────────────────────┐
  │           USER            ├──────────────────────►│           NOTE            │
  ├───────────────────────────┤                       ├───────────────────────────┤
  │ _id: ObjectId             │                       │ _id: ObjectId             │
  │ name: String              │                       │ userId: Ref(User)         │
  │ email: String (unique)    │                       │ title: String             │
  │ passwordHash: String      │                       │ description: String       │
  │ githubHandle: String      │                       │ sections: Array[Section]  │
  │ createdAt: Date           │                       │ tags: Array[String]       │
  └───────────────────────────┘                       │ references: Array[RefLink]│
                │                                     │ isFavorite: Boolean       │
                │                                     │ createdAt: Date           │
                │ 1 : N                               └─────────────▲─────────────┘
                │                                                   │
                ▼                                                   │ N : M
  ┌───────────────────────────┐                                     │ (via References)
  │        NOTES FLOW         │                                     │
  ├───────────────────────────┤                                     │
  │ _id: ObjectId             │                                     │
  │ userId: Ref(User)         │                                     │
  │ title: String             │                                     │
  │ description: String       │                                     │
  │ notes: Array[FlowNoteRef] ├─────────────────────────────────────┘
  │ tags: Array[String]       │  where FlowNoteRef = { noteId: Ref(Note), order: Number }
  │ isFavorite: Boolean       │
  │ createdAt: Date           │
  └───────────────────────────┘
```

---

### 2.2 MongoDB / Mongoose Schema Definitions

#### 1. User Schema (`models/User.js`)
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    avatarUrl: { type: String },
    githubHandle: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
```

#### 2. Note Schema (`models/Note.js`)
```javascript
const mongoose = require('mongoose');

// Embedded Code Snippet Schema
const codeSnippetSchema = new mongoose.Schema({
  language: { type: String, default: 'javascript', required: true },
  title: { type: String, trim: true },
  code: { type: String, required: true }
});

// Embedded Section Schema
const sectionSchema = new mongoose.Schema({
  heading: { type: String, required: true, trim: true },
  explanation: { type: String, trim: true },
  points: [{ type: String, trim: true }],
  codeSnippets: [codeSnippetSchema]
});

// Reference Link Schema
const referenceLinkSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true }
});

// Main Note Schema
const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },
    sections: [sectionSchema],
    tags: [{ type: String, lowercase: true, trim: true, index: true }],
    references: [referenceLinkSchema],
    isFavorite: { type: Boolean, default: false, index: true },
    viewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Compound Text Index for Command Palette Search
noteSchema.index({
  title: 'text',
  description: 'text',
  'sections.heading': 'text',
  'sections.points': 'text',
  'sections.codeSnippets.code': 'text'
});

module.exports = mongoose.model('Note', noteSchema);
```

#### 3. Notes Flow Schema (`models/NotesFlow.js`)
```javascript
const mongoose = require('mongoose');

// Sequential Note Reference Subdocument
const flowNoteReferenceSchema = new mongoose.Schema({
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  order: { type: Number, required: true },
  noteStepTitle: { type: String, trim: true },
  notesSummary: { type: String, trim: true }
});

const notesFlowSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },
    notes: [flowNoteReferenceSchema],
    tags: [{ type: String, lowercase: true, trim: true, index: true }],
    isFavorite: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('NotesFlow', notesFlowSchema);
```

---

## 3. BACKEND REST API ENDPOINTS SPECIFICATION

All endpoints are prefixed with `/api/v1` and require JWT `Authorization: Bearer <token>` header (except public auth routes).

### 3.1 Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Create developer account | `{ name, email, password }` | `{ user, token }` |
| `POST` | `/auth/login` | Authenticate user | `{ email, password }` | `{ user, token }` |
| `GET` | `/auth/me` | Fetch active user profile | None | `{ user }` |

---

### 3.2 Notes Endpoints (`/api/v1/notes`)

| Method | Endpoint | Description | Query / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/notes` | List all notes for active user | `search`, `tag`, `sort`, `page` | `{ count, notes }` |
| `POST` | `/notes` | Create a new Note | `{ title, description, sections, tags, references }` | `{ note }` |
| `GET` | `/notes/:id` | Fetch single Note details | `id: ObjectId` | `{ note }` |
| `PUT` | `/notes/:id` | Update Note content | `{ title, sections, tags, ... }` | `{ note }` |
| `DELETE` | `/notes/:id` | Delete Note (and remove ref from flows) | `id: ObjectId` | `{ message }` |
| `PATCH` | `/notes/:id/favorite` | Toggle favorite state | None | `{ note }` |
| `GET` | `/notes/:id/flows` | Find all Flows containing this Note | `id: ObjectId` | `{ flows }` |

---

### 3.3 Notes Flows Endpoints (`/api/v1/flows`)

| Method | Endpoint | Description | Query / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/flows` | List all Notes Flows | `search`, `tag` | `{ count, flows }` |
| `POST` | `/flows` | Create a connected Notes Flow | `{ title, description, notes: [{ noteId, order }], tags }` | `{ flow }` |
| `GET` | `/flows/:id` | Fetch Flow with populated notes sequence | `id: ObjectId` | `{ flow }` |
| `PUT` | `/flows/:id` | Reorder or update Flow sequence | `{ title, notes: [...], tags }` | `{ flow }` |
| `DELETE` | `/flows/:id` | Delete Flow (does not delete notes) | `id: ObjectId` | `{ message }` |
| `PATCH` | `/flows/:id/favorite` | Toggle favorite flow state | None | `{ flow }` |

---

### 3.4 Command Palette Search (`/api/v1/search`)

| Method | Endpoint | Description | Query | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/search` | Instant search across titles, code, points, tags & flows | `q=express` | `{ notes: [...], flows: [...] }` |

---

## 4. BACKEND FOLDER STRUCTURE

```text
server/
├── config/
│   └── db.js                    # Database connection (MongoDB / Postgres)
├── models/
│   ├── User.js                  # User schema
│   ├── Note.js                  # Note schema with embedded sections & snippets
│   └── NotesFlow.js             # Notes Flow schema with sequence references
├── routes/
│   ├── authRoutes.js            # Auth endpoints
│   ├── noteRoutes.js            # Note CRUD & used-in-flows endpoints
│   ├── flowRoutes.js            # Flow CRUD endpoints
│   └── searchRoutes.js          # Command palette search endpoint
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── noteController.js        # Note business logic & handlers
│   ├── flowController.js        # Flow business logic & populated sequence handlers
│   └── searchController.js      # Global search logic
├── middleware/
│   ├── authMiddleware.js        # JWT token verification & req.user attachment
│   ├── validateMiddleware.js    # Zod request body validation
│   └── errorMiddleware.js       # Centralized 500/400 error handler
├── validators/
│   ├── noteValidator.js         # Zod schemas for note creation
│   └── flowValidator.js         # Zod schemas for flow creation
└── server.js                    # Express application entry point
```

---

## 5. FULL-STACK STEP-BY-STEP DEVELOPMENT PHASES

### Backend Development Phases

#### Phase B1: Express Server & Database Connection
1. Initialize `server/package.json` and install dependencies: `express`, `mongoose`, `dotenv`, `jsonwebtoken`, `bcryptjs`, `cors`, `zod`, `helmet`, `morgan`.
2. Setup `config/db.js` to establish Mongoose connection to MongoDB.
3. Configure `server.js` with JSON body parser, CORS, security headers, and mount route handlers.

#### Phase B2: Schemas & Database Indexes
1. Build `models/User.js` with bcrypt password hashing hook.
2. Build `models/Note.js` with embedded `sections`, `points`, `codeSnippets`, and compound MongoDB `$text` search index.
3. Build `models/NotesFlow.js` with array of note references (`noteId: ObjectId`, `order: Number`).

#### Phase B3: JWT Authentication & Security
1. Create `middleware/authMiddleware.js` to extract `Bearer <token>`, verify JWT, and attach `req.user`.
2. Implement `authController.js` for user registration, password verification, and JWT signing.

#### Phase B4: Notes Domain Implementation
1. Implement `noteController.js`:
   - `getNotes`: Filter by user, search query, and tags.
   - `createNote`: Save title, description, sections, points, snippets, tags.
   - `getNoteById`: Fetch single note.
   - `getNoteFlows`: Execute `NotesFlow.find({ 'notes.noteId': noteId })` to return all flows containing the note (**Bidirectional linkage!**).

#### Phase B5: Notes Flow Domain Implementation
1. Implement `flowController.js`:
   - `getFlowById`: Execute `.populate('notes.noteId')` to return full note details in sequence order.
   - `createFlow`: Validate note references exist and save step order.

#### Phase B6: Global Command Palette Search & Centralized Error Middleware
1. Implement `searchController.js` executing text searches across notes and flows concurrently using `Promise.all()`.
2. Build `middleware/errorMiddleware.js` to format standardized API error outputs (`{ success: false, error: message }`).

---

### Frontend Integration Phases

#### Phase F1: Frontend Architecture & Components
1. Scaffolding Vite + React + TypeScript + Tailwind CSS v4 project.
2. Configure design system, dark-first developer theme variables, and `.light` theme overrides in `index.css`.

#### Phase F2: State Management & API Client
1. Create API client wrapper (`src/services/api.ts`) using `fetch` / `axios` with JWT token interceptor.
2. Create `src/context/AppContext.tsx` for global navigation, notes & flows caching, local storage fallback, toasts, and theme switching.

#### Phase F3: Notes System Views
1. Build `NoteCard`, `NotesList` (search, tag pills, sorting), `NoteEditor` (dynamic sections, points, syntax code snippets), and `NoteDetail` (reader with Table of Contents and **"Used in Notes Flows"** panel).

#### Phase F4: Notes Flow System Views
1. Build `FlowCard`, `FlowsList`, `FlowEditor` (step reordering with handles), `NoteSelectorModal` (search existing notes drawer), and `FlowDetail` (interactive visual node flowchart with note inspector drawer).

#### Phase F5: Command Palette, Favorites, Settings & Verification
1. Build `CommandPalette` (`Ctrl+K`), `FavoritesView`, `TagsView`, and `SettingsView` (theme selector, font options, JSON export).
2. Execute `npx tsc --noEmit` and `npx vite build` to verify clean compilation with 0 errors.

---

## 6. VERIFICATION & DEPLOYMENT COMMANDS

### Running Backend Server
```bash
cd server
npm run dev
```

### Running Frontend Application
```bash
cd client
npm run dev
```

### Production Build Check
```bash
npm run build
```

This guide provides the complete architectural, database schema, and step-by-step development specifications for building the **DevNotes** full-stack platform.
