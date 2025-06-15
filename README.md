# PCWV2 - PC Wala Online

A comprehensive e-commerce platform specialized for PC hardware components with custom PC builder functionality.

## Project Overview

PCWV2 is built with Next.js 14 App Router and follows a strict four-phase development approach:

- **Phase A**: Foundation & Dependencies ✅ **COMPLETE**
- **Phase B**: Admin CMS - *In Progress*
- **Phase C**: Public Website - *Pending*
- **Phase D**: Final Integration & Deployment - *Pending*

## Tech Stack

- **Frontend**: Next.js 14.2.3 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL 8.0+ (via XAMPP)
- **Authentication**: JWT with bcryptjs
- **Validation**: Zod
- **Deployment**: Production deployment planned for Phase D

## Getting Started

### Prerequisites

- Node.js 20+ LTS
- XAMPP (for MySQL database)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pcw-v3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/pcwv2"
   JWT_SECRET="your-super-secure-jwt-secret-key"
   ADMIN_REGISTRATION_CODE="PCWV2_ADMIN_2025"
   NEXT_PUBLIC_WHATSAPP_NUMBER="+923001234567"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

4. **Start XAMPP MySQL service**

5. **Set up the database**
   ```bash
   # Create database
   mysql -u root -e "CREATE DATABASE pcwv2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed initial data
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with initial data

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin CMS route group
│   ├── (public)/          # Public website route group
│   ├── api/               # API route handlers
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── public/           # Public-specific components
│   └── ui/               # Generic UI components
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication helpers
│   ├── prisma.ts         # Database client
│   ├── utils.ts          # General utilities
│   └── validators.ts     # Zod validation schemas
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

## Phase A Completion Status ✅

### ✅ Completed Features

1. **Project Setup**
   - Next.js 14.2.3 with TypeScript and Tailwind CSS
   - ESLint and Prettier configuration
   - Route groups for admin and public sections

2. **Database Configuration**
   - MySQL database `pcwv2` created
   - Prisma ORM with comprehensive schema
   - Database seeded with initial data (admin user, categories, brands, settings)

3. **Core Infrastructure**
   - Authentication system with JWT
   - Input validation with Zod
   - Utility functions for common operations
   - TypeScript type definitions

4. **Basic UI Components**
   - Button, Input, Textarea, Card, Skeleton components
   - Responsive layouts for admin and public sections
   - Global CSS with custom utility classes

5. **Essential Pages**
   - Public homepage with hero section and features
   - Admin dashboard with stats and quick actions
   - Error handling pages (404, global error)

6. **API Infrastructure**
   - Health check endpoint
   - Database connection utilities
   - Environment configuration

### 🔐 Default Admin Credentials

- **Email**: admin@pcwala.com
- **Password**: admin123456
- **Registration Code**: PCWV2_ADMIN_2025

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://root:@localhost:3306/pcwv2` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secure-jwt-secret-key` |
| `ADMIN_REGISTRATION_CODE` | Code for admin registration | `PCWV2_ADMIN_2025` |
| `UPLOADS_DIR` | Directory for file uploads | `/uploads` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp business number | `+923001234567` |
| `NEXT_PUBLIC_SITE_URL` | Site URL for production | `http://localhost:3000` |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID | *(optional)* |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID | *(optional)* |

## Database Schema

The application uses a comprehensive database schema with the following main entities:

- **AdminUser**: System administrators with role-based access
- **Category**: Product categories with hierarchical support
- **Brand**: Hardware manufacturers and brands
- **Product**: PC components with detailed specifications
- **Order**: Customer orders with complete tracking
- **PCBuild**: Custom PC configurations
- **Cart**: Persistent shopping cart
- **SiteSetting**: Configurable site settings

## API Health Check

Test the database connection:
```bash
curl http://localhost:3000/api/health
```

## Next Steps (Phase B)

1. Admin authentication system
2. Product management interface
3. Category and brand management
4. Order management system
5. Site settings configuration
6. File upload functionality
7. Dashboard analytics

## Development Guidelines

- Follow TypeScript strict mode
- Use Tailwind CSS for styling
- Implement proper error handling
- Add proper validation for all forms
- Follow the established folder structure
- Write clean, documented code

## Support

For development questions or issues, refer to the phase documentation files:
- `PHASE_A_FOUNDATION.md`
- `PHASE_B_ADMIN_CMS.md`
- `PHASE_C_PUBLIC_WEBSITE.md`
- `PHASE_D_FINAL_INTEGRATION.md`

---

**Current Status**: Phase A Complete ✅ | Phase B Ready to Start 🚀
# pcwo
