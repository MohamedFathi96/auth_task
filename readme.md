# Auth App - Full Stack Authentication System

A modern full-stack authentication application built with NestJS backend and React frontend.

## Quick Start

### Prerequisites

- Node.js (v18+)
- pnpm
- MongoDB database

### Setup

1. **Clone and install dependencies**

```bash
# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

2. **Database setup**

```bash
cd backend
# Copy environment file
cp env.example .env

# Add your MongoDB connection string to .env
# DATABASE_URL="mongodb://localhost:27017/your-database"

# Generate Prisma client and push schema
pnpm prisma generate
pnpm prisma db push
```

3. **Start development servers**

```bash
# Backend (runs on :3000)
cd backend
pnpm run start:dev

# Frontend (runs on :5173)
cd frontend
pnpm run dev
```

## Features

- **JWT Authentication** - Secure token-based auth with refresh tokens
- **User Registration & Login** - Complete auth flow with validation
- **Protected Routes** - Route guards and middleware protection
- **Automatic Token Refresh** - Seamless token renewal with interceptors
- **Modular Architecture** - Clean separation of concerns
- **Type Safety** - Full TypeScript implementation
- **Form Validation** - Client and server-side validation

## Tech Stack

**Backend:**

- NestJS with TypeScript
- Prisma ORM with MongoDB
- JWT with Passport
- bcryptjs for password hashing
- Class validation

**Frontend:**

- React with TypeScript
- TanStack Router for routing
- TanStack Query for state management
- Axios with interceptors
- Zod for validation
- Tailwind CSS + shadcn/ui

## Best Practices

- **Security**: Password hashing, JWT tokens, input validation
- **Architecture**: Modular design, dependency injection, clean separation
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Error Handling**: Global exception filters and proper error responses
- **Code Quality**: ESLint, Prettier, and consistent coding standards
- **State Management**: Context API with proper token management
- **API Design**: RESTful endpoints with consistent response structure
