# LACTIVAE™ - Supabase & Resend Setup Guide

This guide will help you set up authentication, database, and email functionality for the LACTIVAE™ platform.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- A Resend account for email sending

## 1. Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the details:
   - **Name**: lactivae
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for setup to complete

### Get Your API Keys

1. Go to **Project Settings** > **API**
2. Copy these values to your `.env.local` file:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Create Database Tables

Run these SQL commands in the **SQL Editor** (Supabase Dashboard):

```sql
-- Create profiles table to store subscriber information
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  interest TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('consumer', 'hcp')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create email preferences table
CREATE TABLE email_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  research_updates BOOLEAN DEFAULT TRUE,
  educational_resources BOOLEAN DEFAULT TRUE,
  local_partnerships BOOLEAN DEFAULT TRUE,
  community_news BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for email_preferences
CREATE POLICY "Users can view own email preferences"
  ON email_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own email preferences"
  ON email_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email preferences"
  ON email_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create email history table (for storing sent emails)
CREATE TABLE email_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  email_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE email_history ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own email history
CREATE POLICY "Users can view own email history"
  ON email_history FOR SELECT
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_interest ON profiles(interest);
CREATE INDEX idx_profiles_zip_code ON profiles(zip_code);
CREATE INDEX idx_email_history_user_id ON email_history(user_id);
CREATE INDEX idx_email_history_sent_at ON email_history(sent_at DESC);
```

### Configure Email Templates

1. Go to **Authentication** > **Email Templates**
2. Customize the **Magic Link** template:

```html
<h2>Welcome to LACTIVAE™</h2>
<p>Click the link below to sign in to your account:</p>
<p><a href="{{ .ConfirmationURL }}">Sign In to LACTIVAE™</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this email, you can safely ignore it.</p>
```

### Configure Auth Settings

1. Go to **Authentication** > **URL Configuration**
2. Add your site URL:
   - **Site URL**: `http://localhost:3000` (development) or your production URL
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback` and production URL

## 2. Resend Setup

### Create Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address

### Get API Key

1. Go to **API Keys** in your Resend dashboard
2. Click **Create API Key**
3. Name it "LACTIVAE Production" or "LACTIVAE Development"
4. Copy the key to your `.env.local` file as `RESEND_API_KEY`

### Configure Domain (Production)

For production, you'll want to use your own domain:

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `lactivae.com`)
4. Add the DNS records Resend provides to your domain registrar
5. Wait for verification (usually takes a few minutes)
6. Update `.env.local` with `RESEND_FROM_EMAIL=LACTIVAE <noreply@lactivae.com>`

For development, you can use Resend's test domain: `onboarding@resend.dev`

## 3. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy from .env.local.example and fill in your values
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=LACTIVAE <noreply@yourdomain.com>

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ IMPORTANT**: Never commit `.env.local` to version control!

## 4. Next Steps

Now you need to implement the API routes for:

1. **Registration API** (`/api/auth/register`)
   - Create user with Supabase Auth
   - Insert profile data
   - Create default email preferences
   - Send welcome email via Resend

2. **Auth Callback** (`/app/auth/callback/route.ts`)
   - Handle magic link callback
   - Set session cookie
   - Redirect to profile or home page

3. **Profile API** (`/api/profile`)
   - Get user profile
   - Update user profile
   - Get/update email preferences

4. **Email History API** (`/api/email/history`)
   - Retrieve past emails sent to user
   - Track opens and clicks

## Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/register`

3. Fill out the form and submit

4. Check your email for the magic link

5. Click the link to complete registration

## Troubleshooting

### Magic Link Not Sending

- Check Supabase **Authentication** > **Providers** - ensure Email provider is enabled
- Verify email templates are configured
- Check Supabase logs in **Logs** > **Auth Logs**

### Resend Emails Not Sending

- Verify API key is correct
- Check Resend dashboard **Logs** for errors
- Ensure FROM email domain is verified (for production)
- Check rate limits on free tier

### Database Errors

- Run SQL commands again in correct order
- Check **Database** > **Logs** for specific errors
- Verify RLS policies are correct

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Resend Documentation](https://resend.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
