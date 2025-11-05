# Migration Guide: Clerk to Auth.js v5

This document outlines the migration from Clerk to Auth.js v5 (NextAuth v5) for the AI Room Redesign application.

## What Changed

### 1. Authentication Provider
- **Before**: Clerk (`@clerk/nextjs`)
- **After**: Auth.js v5 (`next-auth@5.0.0-beta.25`)

### 2. Database Schema Updates
The database schema has been updated to support Auth.js:

#### Updated Tables:
- **users**: Modified to use UUID as primary key, added `emailVerified`, `password` fields
- **accounts**: New table for OAuth provider data
- **sessions**: New table for session management
- **verificationToken**: New table for email verification
- **aiGeneratedImage**: Changed from `userEmail` to `userId` foreign key

### 3. Authentication Methods
Auth.js v5 now supports:
- **Google OAuth** - Sign in with Google
- **GitHub OAuth** - Sign in with GitHub  
- **Email/Password** - Traditional credentials-based authentication

## Setup Instructions

### 1. Environment Variables

Update your `.env` file with the following variables:

```env
# Database
NEXT_PUBLIC_DATABSE_URL=your_database_url

# Auth.js v5 - Generate a secret with: openssl rand -base64 32
AUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth (Get from GitHub Developer Settings)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Replicate API
NEXT_PUBLICK_REPLICATE_API_TOKEN=your_replicate_token

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 2. Generate AUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Set Up OAuth Providers

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

#### GitHub OAuth:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and generate Client Secret
6. Add to `.env`

### 4. Database Migration

You need to run database migrations to create the new Auth.js tables:

```bash
cd ai-room-redesign-main
npx drizzle-kit push
```

This will create the following tables:
- `accounts`
- `sessions`
- `verificationToken`
- Update the `users` table structure

**Important**: If you have existing users, you may need to migrate their data. The new schema uses UUID for user IDs instead of auto-incrementing integers.

### 5. Install Dependencies

Dependencies have already been updated in `package.json`. Run:

```bash
npm install
```

### 6. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to test the application.

## Key Differences from Clerk

### Authentication Flow
- **Sign In**: `/sign-in` - Custom form with OAuth buttons
- **Sign Up**: `/sign-up` - Custom form with OAuth buttons
- **Sign Out**: Use `signOut()` from `next-auth/react`

### Accessing User Data

**Before (Clerk):**
```javascript
import { useUser } from '@clerk/nextjs'
const { user } = useUser()
// Access: user.fullName, user.primaryEmailAddress.emailAddress
```

**After (Auth.js):**
```javascript
import { useSession } from 'next-auth/react'
const { data: session } = useSession()
// Access: session.user.name, session.user.email, session.user.id
```

### Server-Side Authentication

**Before (Clerk):**
```javascript
import { auth } from '@clerk/nextjs/server'
const { userId } = auth()
```

**After (Auth.js):**
```javascript
import { auth } from '@/auth'
const session = await auth()
const userId = session?.user?.id
```

### Protected Routes

Routes are automatically protected by the middleware in `middleware.js`. The middleware checks for valid sessions and redirects unauthenticated users to `/sign-in`.

## Testing Checklist

- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Sign in with Google
- [ ] Sign in with GitHub
- [ ] Access protected dashboard routes
- [ ] User credits display correctly
- [ ] Create new room design
- [ ] View existing room designs
- [ ] Sign out functionality

## Troubleshooting

### "Invalid credentials" error
- Verify your OAuth credentials are correct
- Check that redirect URIs match exactly
- Ensure AUTH_SECRET is set

### Database errors
- Run `npx drizzle-kit push` to apply schema changes
- Check database connection string

### Session not persisting
- Clear browser cookies
- Verify AUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain

## Additional Notes

- User sessions are stored in the database for better security
- JWT tokens include user credits for quick access
- Password hashing uses bcryptjs with salt rounds of 10
- OAuth users are automatically created in the database on first sign-in

## Support

For issues or questions about the migration, please refer to:
- [Auth.js Documentation](https://authjs.dev/)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
