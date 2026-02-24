# Advika Vastu-Structural (P M & Associates)

This is a comprehensive web application for P M & Associates, specializing in Architectural, Planning, and Engineering services.

## Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Prisma](https://www.prisma.io/) with PostgreSQL (Supabase)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js v5 Beta](https://next-auth.js.org/)
- **Payments**: [Razorpay](https://razorpay.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **State/Animations**: [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)

## Detailed Project Structure

### `/src`
The heart of the application.
- **`/app`**: Next.js App Router folders.
  - `(auth)/`: Authentication routes.
  - `admin/`: Complete admin dashboard for managing all site content.
    - `home/`, `about/`, `services/`, `plans/`, `products/`, `testimonials/`, `gallery/`, `contact/`, `cta/`, `legal/`, `calculators/`, `settings/`
  - `api/`: Backend API endpoints.
    - `admin/`: Management APIs for each section.
    - `auth/`: Authentication endpoints.
    - `chat/`: AI Chatbot backend.
    - `payments/`: Razorpay integration logic.
  - `shop/`: Public-facing store interface.
  - `about/`, `contact/`, `gallery/`, `legal/`, `plans/`, `services/`: Public informational pages.
  - `globals.css`: Global styles (Tailwind v4 imports).
  - `layout.tsx`: Root layout with font and provider setup.
  - `page.tsx`: Home page entry point.
- **`/components`**: UI components.
  - `layout/`: Shared components like `Header.tsx`, `Footer.tsx`.
  - `ui/`: Atom-level components (Button, Input, Badge, etc.).
  - `Chatbot.tsx`: The AI assistant component.
  - `WelcomePopup.tsx`: Promotional or information modal.
- **`/lib`**: Server-side logic and utilities.
  - `prisma.ts`: Shared Prisma client instance.
  - `auth.ts`: NextAuth configuration and providers.
  - `chatbot-engine.ts`: Core AI logic.
  - `api-utils.ts`: Helpers for API responses and handling.
- **`/hooks`**: Custom React hooks for client-side state.
- **`/types`**: Project-wide TypeScript interfaces and types.

### `/prisma`
- `schema.prisma`: The database source of truth.
- `seed.ts`: Script to populate the database with initial/dev data.

### `/public`
- Static assets (logos, icons, SVG files).

### Key Files
- `.env`: Environment variables (Secret keys, DB URLs).
- `next.config.ts`: Next.js behavior configuration.
- `package.json`: Dependency list and operation scripts.
- `ARCHITECTURE.md`: Technical overview of the system.
- `.vscode/settings.json`: Editor-specific settings (e.g., suppressing CSS warnings).

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Environment**:
   Copy `.env.example` to `.env` and fill in the required variables.

3. **Database Setup**:
   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Development Workflows
- **Update Database**: Modify `prisma/schema.prisma` then run `npx prisma migrate dev`.
- **Admin Panel**: Accessible at `/admin` (requires admin credentials).
- **Styling**: Uses Tailwind CSS v4. Add new tokens in `@theme` block within `globals.css`.
