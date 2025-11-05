# Quick Start - Testing Your Auth.js Migration

Follow these steps to quickly test your migration:

## Step 1: Generate AUTH_SECRET

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output - you'll need it for the next step.

## Step 2: Create .env File

Create a file named `.env` in the `ai-room-redesign-main` folder with this content:

```env
# Database - Use your existing database URL
NEXT_PUBLIC_DATABSE_URL=your_database_url_here

# Auth.js - Paste the secret you generated above
AUTH_SECRET=paste_your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000

# Optional OAuth (can skip for initial testing)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Your existing API keys
NEXT_PUBLICK_REPLICATE_API_TOKEN=your_replicate_token
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

**Important:** Replace the placeholder values with your actual credentials!

## Step 3: Update Database Schema

Run this command to create the new Auth.js tables:

```bash
npx drizzle-kit push
```

This will:
- Create `accounts` table for OAuth
- Create `sessions` table for session management
- Create `verificationToken` table
- Update `users` table structure

## Step 4: Start the Development Server

```bash
npm run dev
```

The server should start at http://localhost:3000

## Step 5: Quick Test

### Test 1: Check the Sign-Up Page

1. Open: http://localhost:3000/sign-up
2. You should see a beautiful sign-up form with:
   - Email/password fields
   - Google OAuth button
   - GitHub OAuth button

### Test 2: Create a Test Account

1. Fill in the form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Confirm: "password123"
2. Click "Create account"
3. You should be:
   - Automatically signed in
   - Redirected to `/dashboard`
   - See your name in the header
   - See "3" credits

### Test 3: Sign Out and Sign In

1. Hover over your avatar in the header
2. Click "Sign out"
3. Go to: http://localhost:3000/sign-in
4. Sign in with:
   - Email: "test@example.com"
   - Password: "password123"
5. You should be back in the dashboard

### Test 4: Protected Routes

1. Sign out
2. Try to access: http://localhost:3000/dashboard
3. You should be redirected to `/sign-in`

## ✅ Success Indicators

If all the above works, your migration is successful! You should see:

- ✅ Sign-up page loads without errors
- ✅ Can create an account with email/password
- ✅ Automatically signed in after registration
- ✅ Dashboard shows user name and credits
- ✅ Can sign out successfully
- ✅ Can sign back in
- ✅ Protected routes redirect when not authenticated

## 🔧 Troubleshooting

### Server won't start?
- Check if all dependencies are installed: `npm install`
- Look for error messages in the terminal
- Verify your `.env` file exists and has AUTH_SECRET

### Can't create account?
- Check browser console for errors (F12)
- Verify database connection in `.env`
- Make sure you ran `npx drizzle-kit push`

### Not redirecting after sign-in?
- Clear browser cookies
- Check browser console for errors
- Verify NEXTAUTH_URL in `.env` is `http://localhost:3000`

### Database errors?
- Verify your database URL is correct
- Make sure database is running
- Run `npx drizzle-kit push` again

## 📋 Full Testing

For comprehensive testing, see `TESTING_GUIDE.md` which includes:
- OAuth testing (Google, GitHub)
- API endpoint testing
- Session persistence testing
- Edge case testing

## 🎯 Next Steps

Once basic testing passes:

1. **Set up OAuth** (optional but recommended):
   - Follow instructions in `MIGRATION_GUIDE.md`
   - Test Google and GitHub sign-in

2. **Test all features**:
   - Create room designs
   - Check credits system
   - Test PayPal integration

3. **Production deployment**:
   - Update production environment variables
   - Run database migrations on production
   - Test in production environment

## 📚 Additional Resources

- **TESTING_GUIDE.md** - Comprehensive testing checklist
- **MIGRATION_GUIDE.md** - Full migration documentation
- **Auth.js Docs** - https://authjs.dev/

---

**Need help?** Check the troubleshooting sections in TESTING_GUIDE.md or MIGRATION_GUIDE.md
