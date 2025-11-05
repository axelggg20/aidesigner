# Prisma Migration Guide

This project has been migrated from Neon Database with Drizzle ORM to PostgreSQL with Prisma ORM.

## What Changed

### Dependencies
- **Removed**: `@neondatabase/serverless`, `drizzle-orm`, `drizzle-kit`, `@auth/drizzle-adapter`
- **Added**: `prisma`, `@prisma/client`, `@auth/prisma-adapter`

### Files Removed
- `config/db.js` - Old Drizzle database connection
- `config/schema.js` - Old Drizzle schema
- `drizzle.config.js` - Drizzle configuration

### Files Added
- `prisma/schema.prisma` - Prisma schema definition
- `lib/prisma.js` - Prisma client instance
- `app/api/get-user-rooms/route.js` - API route for fetching user rooms
- `app/api/update-credits/route.js` - API route for updating user credits
- `app/api/deduct-credit/route.js` - API route for deducting credits

### Files Modified
- `auth.js` - Updated to use PrismaAdapter
- `.env.example` - Updated with PostgreSQL DATABASE_URL
- All API routes and components that used Drizzle

## Database Setup

### 1. Set Up PostgreSQL Database

You need a PostgreSQL database. You can use:
- Local PostgreSQL installation
- Docker container
- Cloud providers (Supabase, Railway, Neon, etc.)

### 2. Configure Environment Variables

Create a `.env` file (or `.env.local`) in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"

# Auth.js v5
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Replicate API
NEXT_PUBLICK_REPLICATE_API_TOKEN=

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
```

**Important**: Replace the `DATABASE_URL` with your actual PostgreSQL connection string.

### 3. Run Prisma Migrations

To create the database tables, run:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database tables based on the schema
- Generate the Prisma Client
- Create a migration history

### 4. (Optional) Seed the Database

If you need to seed initial data, you can create a `prisma/seed.js` file and run:

```bash
npx prisma db seed
```

## Prisma Commands

### Generate Prisma Client
After any schema changes:
```bash
npx prisma generate
```

### Create a Migration
After modifying the schema:
```bash
npx prisma migrate dev --name description_of_changes
```

### View Database in Prisma Studio
To visually explore your database:
```bash
npx prisma studio
```

### Reset Database (Development Only)
To reset the database and re-run all migrations:
```bash
npx prisma migrate reset
```

## Schema Overview

The Prisma schema includes the following models:

### User
- `id` (String, Primary Key)
- `name` (String, Optional)
- `email` (String, Unique)
- `emailVerified` (DateTime, Optional)
- `image` (String, Optional)
- `password` (String, Optional)
- `credits` (Int, Default: 3)

### Account
- NextAuth.js account table for OAuth providers

### Session
- NextAuth.js session table

### VerificationToken
- NextAuth.js verification token table

### AiGeneratedImage
- `id` (Int, Primary Key, Auto-increment)
- `roomType` (String)
- `designType` (String)
- `orgImage` (String)
- `aiImage` (String)
- `userId` (String, Optional, Foreign Key to User)

## Migration from Existing Data

If you have existing data in a Neon database that you want to migrate:

1. Export your data from Neon
2. Set up your new PostgreSQL database
3. Run the Prisma migrations to create the schema
4. Import your data into the new PostgreSQL database

## Troubleshooting

### "Prisma Client is not generated"
Run: `npx prisma generate`

### "Database connection error"
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database credentials

### "Migration failed"
- Check if the database exists
- Ensure you have proper permissions
- Review the error message for specific issues

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [NextAuth.js with Prisma](https://next-auth.js.org/adapters/prisma)
