# Cloudflare R2 Migration Guide

This guide will help you complete the migration from Firebase Storage to Cloudflare R2.

## What Has Been Done

✅ Installed `@aws-sdk/client-s3` package
✅ Created R2 configuration file (`config/r2Config.js`)
✅ Updated API route to use R2 instead of Firebase (`app/api/redesign-room/route.jsx`)
✅ Created environment variables template (`.env.example`)

## Steps to Complete the Migration

### 1. Set Up Cloudflare R2

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** in the sidebar
3. Create a new R2 bucket (e.g., `ai-room-redesign`)
4. Go to **R2 API Tokens** and create a new API token with:
   - Permissions: Object Read & Write
   - Apply to specific buckets: Select your bucket

### 2. Configure R2 Public Access (Optional but Recommended)

To make your images publicly accessible:

1. In your R2 bucket settings, go to **Settings** → **Public Access**
2. Connect a custom domain or use R2.dev subdomain
3. Enable public access for the bucket
4. Note down your public URL (e.g., `https://pub-xxxxx.r2.dev` or your custom domain)

### 3. Update Environment Variables

Add these variables to your `.env.local` file:

```env
# Cloudflare R2 Storage
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-public-domain.com
```

**How to find these values:**

- **R2_ENDPOINT**: Found in your R2 bucket details (format: `https://<account-id>.r2.cloudflarestorage.com`)
- **R2_ACCESS_KEY_ID**: From the API token you created
- **R2_SECRET_ACCESS_KEY**: From the API token you created
- **R2_BUCKET_NAME**: The name of your R2 bucket
- **R2_PUBLIC_URL**: Your R2 public domain (without trailing slash)

### 4. Test the Migration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Try uploading and redesigning a room image
3. Verify that:
   - Images are uploaded to R2
   - Images are publicly accessible via the R2 URL
   - Images are saved correctly in the database

### 5. Optional: Remove Firebase Dependencies

If you're no longer using Firebase for anything else:

1. Remove Firebase from `package.json`:
   ```bash
   npm uninstall firebase
   ```

2. Delete or archive `config/firebaseConfig.js`

3. Remove Firebase environment variables from `.env.local`

## Troubleshooting

### Images not uploading
- Check that your R2 credentials are correct
- Verify the bucket name matches exactly
- Ensure the API token has write permissions

### Images not accessible
- Make sure public access is enabled on your R2 bucket
- Verify the R2_PUBLIC_URL is correct and doesn't have a trailing slash
- Check that the bucket is connected to a public domain

### CORS Issues
If you encounter CORS errors when accessing images:

1. Go to your R2 bucket settings
2. Add CORS rules:
   ```json
   [
     {
       "AllowedOrigins": ["*"],
       "AllowedMethods": ["GET"],
       "AllowedHeaders": ["*"]
     }
   ]
   ```

## Cost Comparison

**Cloudflare R2 Advantages:**
- No egress fees (bandwidth is free)
- $0.015 per GB stored per month
- First 10 GB storage free per month
- More cost-effective for high-traffic applications

**Firebase Storage:**
- Charges for both storage and bandwidth
- Can become expensive with high traffic

## Support

If you encounter any issues during migration, check:
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [AWS SDK for JavaScript v3 Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
