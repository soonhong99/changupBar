# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a commercial real estate listing platform ("changupBar") built with a monorepo structure using pnpm workspaces. The application consists of:
- **Web**: Next.js 15 frontend with React 19 and TailwindCSS
- **API**: Express.js backend with TypeScript and Prisma ORM
- **Shared**: Common schemas and types using Zod validation
- **Database**: PostgreSQL running in Docker

## Development Commands

### Starting the Development Environment
```bash
# Start database
docker-compose up -d

# Start web frontend (runs on localhost:3000)
pnpm --filter web dev

# Start API backend (runs on localhost:4000)
pnpm --filter api dev

# Open Prisma Studio for database management
pnpm --filter api exec prisma studio
```

### Build Commands
```bash
# Build web frontend
pnpm --filter web build

# Build API backend
pnpm --filter api build

# Start production API
pnpm --filter api start
```

### Linting and Type Checking
```bash
# Lint web frontend
pnpm --filter web lint

# Type check (implicit through build process)
pnpm --filter api build
pnpm --filter web build
```

### Database Operations
```bash
# Generate Prisma client
pnpm --filter api exec prisma generate

# Run database migrations
pnpm --filter api exec prisma migrate dev

# Reset database
pnpm --filter api exec prisma migrate reset
```

## Architecture

### Monorepo Structure
- Uses pnpm workspaces with packages in `packages/` directory
- Shared types and schemas in `packages/shared/`
- API uses workspace reference to shared package

### Database Architecture
- PostgreSQL with Prisma ORM
- Schema defined in `packages/api/prisma/schema.prisma`
- Migrations stored in `packages/api/prisma/migrations/`
- Models include: User, Listing, Like, ConsultationRequest with social login support

### API Structure
- Express.js with TypeScript and ES modules
- Controllers handle request/response logic
- Services contain business logic
- Middleware for authentication (JWT) and optional auth
- File uploads via AWS S3 integration
- SMS verification using CoolSMS

### Frontend Structure
- Next.js 15 with app router
- Admin panel at `/admin` with protected routes
- Authentication context for state management
- Responsive design with TailwindCSS
- Form components with validation

### Key Features
- Social login integration
- Phone verification system
- File upload with presigned URLs
- Real estate listing management
- Consultation request system
- Admin dashboard with CRUD operations

## Environment Configuration
- API URL: `http://localhost:4000/api/v1`
- Database: PostgreSQL on port 5433
- Admin credentials: testuser@example.com / password123

## Testing
Currently no test framework is configured. Tests should be added using a framework like Jest or Vitest.