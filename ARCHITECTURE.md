# Project Architecture & Code Structure

This document provides an overview of the "Advika Vastu-Structural" (P M & Associates) project structure.

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: [Prisma](https://www.prisma.io/) with PostgreSQL (Supabase)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Payments**: [Razorpay](https://razorpay.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/)

## Directory Structure

### `/src`
The core application code.
- **`/app`**: Next.js App Router folders.
  - **`/(auth)`**: Authentication-related routes (Login, Signup).
  - **`/admin`**: Admin panel for managing content, products, and users.
  - **`/api`**: Backend API routes (Admin, Payments, Orders).
  - **`/shop`**: Public shop interface.
- **`/components`**: Reusable UI components.
  - **`/layout`**: Header, Footer, and structural components.
  - **`/ui`**: Base UI components (Buttons, Inputs, Dialogs).
- **`/lib`**: Utility functions, Prisma client, and shared logic.
- **`/hooks`**: Custom React hooks.
- **`/types`**: TypeScript type definitions.

### `/prisma`
- **`schema.prisma`**: Database schema definition.
- **`seed.ts`**: Database seeding script for development.

### `/public`
- Static assets like images, icons, and fonts.

## Key Configuration Files
- `next.config.ts`: Next.js configuration.
- `package.json`: Project dependencies and scripts.
- `.env`: Environment variables (Database URLs, API keys).
- `tsconfig.json`: TypeScript configuration.
- `postcss.config.mjs`: PostCSS configuration for Tailwind.

## Common Workflows
- **Development**: `npm run dev`
- **Database Migration**: `npx prisma migrate dev`
- **Database Studio**: `npx prisma studio`
- **Seeding Database**: `npm run db:seed`
- **Build for Production**: `npm run build`
