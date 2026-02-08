# 🧠 Task Management System – MERN Stack

A full-stack **Task Management System** built using the **MERN stack** with **TypeScript** on both frontend and backend.  
The application allows users to authenticate, manage tasks with attachments, and view task analytics using a clean and scalable architecture.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User signup with OTP verification
- User signin and logout
- Google authentication
- JWT-based authentication using **HTTP-only cookies**
- Protected routes with authentication middleware

### ✅ Task Management
- Create, update, delete, and view tasks
- Attach multiple files to tasks
- Task priority and due date handling
- User-specific task access

### 📊 Analytics
- Task analytics for authenticated users
- Summary insights based on user tasks

### 🧰 Developer Experience
- Clean **Repository Pattern** architecture
- Swagger API documentation
- Fully type-safe codebase with TypeScript
- Custom CSS in frontend (no CSS frameworks)

---

## 🛠️ Tech Stack

### Frontend
- React.js
- TypeScript
- Custom CSS (no UI frameworks)
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Multer (file uploads)
- Swagger (API documentation)

---
## 📁 Project Structure

```txt
Task-Management/
├── client/                       # React + TypeScript frontend
│   ├── src/
│   │   ├── api/                  # API service layer
│   │   │   ├── auth/             # Auth-related API calls
│   │   │   │   └── authService.ts
│   │   │   └── tasks/            # Task-related API calls
│   │   │       └── taskService.ts
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Application pages
│   │   ├── routes/               # Client-side routes
│   │   │   └── userRoutes.tsx
│   │   ├── redux/                # Redux state management
│   │   │   ├── store.ts
│   │   │   └── slices/
│   │   │       └── authSlice.ts
│   │   ├── styles/               # Custom CSS (no frameworks)
│   │   └── main.tsx
│
├── server/                       # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   ├── routes/               # Express routes
│   │   ├── services/             # Business logic
│   │   ├── repositories/         # Repository pattern (data access layer)
│   │   ├── middlewares/           # Auth, upload, error handling
│   │   ├── swagger/               # Swagger documentation files
│   │   └── utils/                 # Helper utilities
│   └── server.ts                  # Application entry point
│
└── README.md



🔑 Environment Variables
Backend (server/.env)
PORT=3000
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
CLIENT_URL=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

Frontend (client/.env)
VITE_API_BASE_URL=http://localhost:3000

▶️ How to Run the Application
cd server
npm install
npm run dev

Frontend
cd client
npm install
npm run dev

▶️ API Documentation
Access Swagger UI at: http://localhost:3000/api-docs

▶️ Key Features
Authentication:

User registration with email and password
OTP verification for new accounts
Secure login with JWT tokens
Google OAuth integration

Task Management:

Create tasks with title, description, priority, and due date
Upload multiple file attachments.
Edit and delete tasks
View all tasks with filtering and sorting
Analytics:

Dashboard showing task statistics
Breakdown by status (pending, completed, etc.)
Priority-wise task distribution
Architecture:

🏗️ Architecture Decisions
Backend

Implemented Repository Pattern to separate data access from business logic.
Used Controller–Service–Repository layering for maintainability.
JWT authentication handled via HTTP-only cookies for improved security.
Swagger documentation maintained separately to keep route files clean.
Middleware-based authorization ensures secure access to protected routes.

Frontend

Built using React with TypeScript for predictable and maintainable UI.
Custom CSS used instead of CSS frameworks for full control over styling.
Centralized API service layer for cleaner network handling.

🧠 Assumptions Made
Users must be authenticated to perform task operations.
Each task belongs to a single authenticated user.
File uploads are limited to task-related attachments.
OTP verification is required before full access.
Frontend and backend run on different ports during development.
Swagger is the primary tool for API testing and documentation.