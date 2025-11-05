# Testing Guide - Auth.js v5 Migration

This guide will help you verify that the migration from Clerk to Auth.js v5 is working correctly.

## Pre-Testing Setup

### 1. Check Dependencies Installation

First, verify all dependencies are installed:

```bash
cd ai-room-redesign-main
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `ai-room-redesign-main` directory with the following:

```env
# Database - Your existing database URL
NEXT_PUBLIC_DATABSE_URL=your_database_url_here

# Auth.js v5 - Generate with: openssl rand -base64 32
AUTH_SECRET=generate_a_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional for testing - can skip initially)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth (Optional for testing - can skip initially)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Replicate API - Your existing token
NEXT_PUBLICK_REPLICATE_API_TOKEN=your_replicate_token

# Firebase - Your existing key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key

# PayPal - Your existing client ID
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

**Generate AUTH_SECRET:**
```bash
# On Windows (PowerShell):
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# On Mac/Linux:
openssl rand -base64 32
```

### 3. Update Database Schema

Run the database migration to create Auth.js tables:

```bash
npx drizzle-kit push
```

This will create:
- `accounts` table
- `sessions` table
- `verificationToken` table
- Update `users` table structure

## Testing Checklist

### Phase 1: Basic Setup ✓

- [ ] Dependencies installed successfully
- [ ] `.env` file created with AUTH_SECRET
- [ ] Database migration completed
- [ ] Development server starts without errors

**Test Command:**
```bash
npm run dev
```

Expected: Server starts on http://localhost:3000 without errors

---

### Phase 2: Email/Password Authentication 🔐

#### Test 2.1: Sign Up with Email/Password

1. Navigate to: http://localhost:3000/sign-up
2. Fill in the form:
   - Full name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Confirm password: "password123"
3. Click "Create account"

**Expected Results:**
- [ ] Form submits without errors
- [ ] User is created in database
- [ ] Automatically signed in
- [ ] Redirected to `/dashboard`
- [ ] User name appears in header
- [ ] Credits show as 3

**Check Database:**
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```

#### Test 2.2: Sign Out

1. Click on user avatar in header
2. Click "Sign out"

**Expected Results:**
- [ ] User is signed out
- [ ] Redirected to home page or sign-in
- [ ] Cannot access `/dashboard` (redirects to sign-in)

#### Test 2.3: Sign In with Email/Password

1. Navigate to: http://localhost:3000/sign-in
2. Enter credentials:
   - Email: "test@example.com"
   - Password: "password123"
3. Click "Sign in"

**Expected Results:**
- [ ] Successfully signed in
- [ ] Redirected to `/dashboard`
- [ ] User data loads correctly
- [ ] Credits display correctly

#### Test 2.4: Invalid Credentials

1. Try signing in with wrong password
2. Try signing in with non-existent email

**Expected Results:**
- [ ] Shows "Invalid email or password" error
- [ ] Does not sign in
- [ ] Stays on sign-in page

---

### Phase 3: OAuth Authentication (Optional) 🔑

**Note:** Only test if you've set up OAuth credentials

#### Test 3.1: Google OAuth

1. Navigate to: http://localhost:3000/sign-in
2. Click "Continue with Google"
3. Complete Google sign-in flow

**Expected Results:**
- [ ] Redirects to Google
- [ ] After authorization, returns to app
- [ ] User created in database
- [ ] Signed in successfully
- [ ] Redirected to `/dashboard`

#### Test 3.2: GitHub OAuth

1. Navigate to: http://localhost:3000/sign-in
2. Click "Continue with GitHub"
3. Complete GitHub sign-in flow

**Expected Results:**
- [ ] Redirects to GitHub
- [ ] After authorization, returns to app
- [ ] User created in database
- [ ] Signed in successfully
- [ ] Redirected to `/dashboard`

---

### Phase 4: Protected Routes 🔒

#### Test 4.1: Dashboard Access

**When NOT signed in:**
1. Navigate to: http://localhost:3000/dashboard

**Expected Results:**
- [ ] Redirected to `/sign-in`
- [ ] Cannot access dashboard

**When signed in:**
1. Sign in first
2. Navigate to: http://localhost:3000/dashboard

**Expected Results:**
- [ ] Dashboard loads successfully
- [ ] User name displays
- [ ] Credits display
- [ ] Can see room designs (if any exist)

#### Test 4.2: Create New Room

1. Sign in
2. Navigate to: http://localhost:3000/dashboard/create-new

**Expected Results:**
- [ ] Page loads successfully
- [ ] Can select image
- [ ] Can choose room type
- [ ] Can choose design type
- [ ] Generate button is visible

---

### Phase 5: User Context & Credits 💳

#### Test 5.1: User Details Loading

1. Sign in
2. Check browser console for any errors
3. Verify user details load in provider

**Expected Results:**
- [ ] No console errors
- [ ] User details fetch successfully
- [ ] Credits display in header
- [ ] User name displays correctly

#### Test 5.2: Credits Display

1. Sign in
2. Check header for credits badge

**Expected Results:**
- [ ] Credits badge visible
- [ ] Shows correct number (3 for new users)
- [ ] Star icon displays

---

### Phase 6: API Routes 🔌

#### Test 6.1: Verify User API

**Test with browser console:**
```javascript
fetch('/api/verify-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user: {
      id: 'test-id',
      name: 'Test User',
      email: 'test@example.com',
      image: null
    }
  })
}).then(r => r.json()).then(console.log)
```

**Expected Results:**
- [ ] Returns user data
- [ ] No errors in response

#### Test 6.2: Registration API

**Test with browser console:**
```javascript
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'API Test User',
    email: 'apitest@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(console.log)
```

**Expected Results:**
- [ ] Returns success response
- [ ] User created in database
- [ ] No duplicate email errors on retry

---

### Phase 7: Session Persistence 💾

#### Test 7.1: Page Refresh

1. Sign in
2. Refresh the page (F5)

**Expected Results:**
- [ ] Still signed in after refresh
- [ ] User data persists
- [ ] No need to sign in again

#### Test 7.2: Browser Restart

1. Sign in
2. Close browser completely
3. Reopen and navigate to http://localhost:3000/dashboard

**Expected Results:**
- [ ] Still signed in (session persists)
- [ ] User data loads correctly

#### Test 7.3: Session Expiry

Sessions should expire based on your configuration. Default is 30 days.

---

## Common Issues & Solutions

### Issue: "Invalid credentials" on sign-in
**Solution:** 
- Verify password is correct
- Check database for user existence
- Ensure password was hashed correctly during registration

### Issue: OAuth redirect errors
**Solution:**
- Verify OAuth credentials in `.env`
- Check redirect URIs match exactly in OAuth provider settings
- Ensure `NEXTAUTH_URL` is correct

### Issue: Database connection errors
**Solution:**
- Verify `NEXT_PUBLIC_DATABSE_URL` is correct
- Check database is running
- Run `npx drizzle-kit push` again

### Issue: Session not persisting
**Solution:**
- Clear browser cookies
- Verify `AUTH_SECRET` is set
- Check browser console for errors

### Issue: "Cannot find module" errors
**Solution:**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

---

## Quick Test Script

Run this quick test to verify basic functionality:

```bash
# 1. Start the dev server
npm run dev

# 2. In another terminal, test the registration endpoint
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"quicktest@example.com","password":"password123"}'

# Expected: {"success":true,"user":{"id":"...","email":"quicktest@example.com"}}
```

---

## Success Criteria

Your migration is successful if:

✅ All Phase 1 tests pass (basic setup)
✅ All Phase 2 tests pass (email/password auth)
✅ All Phase 4 tests pass (protected routes)
✅ All Phase 5 tests pass (user context)
✅ All Phase 7 tests pass (session persistence)

OAuth tests (Phase 3) are optional but recommended for production.

---

## Next Steps After Testing

Once all tests pass:

1. **Set up OAuth providers** for production (Google, GitHub)
2. **Update production environment variables**
3. **Run database migrations** on production
4. **Test in production environment**
5. **Monitor for any authentication errors**

---

## Need Help?

If you encounter issues:

1. Check browser console for errors
2. Check server terminal for errors
3. Verify all environment variables are set
4. Review the MIGRATION_GUIDE.md
5. Check Auth.js documentation: https://authjs.dev/
