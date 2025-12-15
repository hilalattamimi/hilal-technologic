# Deployment Guide - Hilal Technologic

## Vercel Deployment

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository connected to Vercel
- Supabase project for database and storage

### Environment Variables

Set the following environment variables in Vercel Dashboard > Project Settings > Environment Variables:

#### Database (Required)
```
DATABASE_URL=postgresql://[user]:[password]@[host]:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://[user]:[password]@[host]:5432/postgres
```

#### NextAuth (Required)
```
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
```
> Generate NEXTAUTH_SECRET with: `openssl rand -base64 32`

#### Supabase Storage (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Email SMTP (Required for email verification)
```
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=Your Name <your-email@domain.com>
```

#### SEO & Site (Optional)
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
GOOGLE_SITE_VERIFICATION=your-verification-code
```

### Deployment Steps

1. **Connect Repository**
   - Go to Vercel Dashboard
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Set Environment Variables**
   - Add all required environment variables listed above
   - Make sure to set them for Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Post-Deployment

1. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

2. **Seed Initial Data (if needed)**
   ```bash
   npx prisma db seed
   ```

3. **Configure Custom Domain**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed

4. **Update NEXTAUTH_URL**
   - After setting custom domain, update NEXTAUTH_URL to match

### Vercel Configuration

The `vercel.json` file is configured with:
- Region: Singapore (sin1) for optimal performance in Southeast Asia
- API function timeout: 30 seconds
- Framework: Next.js

### Troubleshooting

#### Build Fails
- Check environment variables are set correctly
- Ensure DATABASE_URL is accessible from Vercel's IP ranges
- Check build logs for specific errors

#### Database Connection Issues
- Verify Supabase connection pooler is enabled
- Use `?pgbouncer=true` in DATABASE_URL for serverless
- Check Supabase dashboard for connection limits

#### Email Not Sending
- Verify SMTP credentials are correct
- For Zoho, use App Password instead of account password
- Check spam folder for test emails

### Security Notes

- Never commit `.env` file to repository
- Use Vercel's environment variables for all secrets
- Rotate NEXTAUTH_SECRET periodically
- Use strong passwords for database and SMTP

### Free Tier Limits (Vercel Hobby)

- 100GB Bandwidth/month
- 1M Edge Requests/month
- 100GB-Hours Serverless Function Execution
- 6,000 Build Minutes/month
- Unlimited deployments

For production with higher traffic, consider upgrading to Vercel Pro.
