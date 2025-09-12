# Supabase Development Setup

## Fix Email Confirmation Issue

The user is getting signed out after signup because Supabase requires email confirmation by default. Here's how to fix it:

### Option 1: Disable Email Confirmation (Recommended for Development)

1. **Go to your Supabase Dashboard**
2. **Navigate to:** Authentication → Settings
3. **Find:** "Email confirmation" section
4. **Uncheck:** "Enable email confirmations"
5. **Save** the changes

### Option 2: Use Google Sign-In (Already Working)

The Google sign-in is already working with mock authentication in development mode, so you can use that instead.

### Option 3: Check Email for Confirmation Link

If you want to keep email confirmation enabled:
1. **Check your email** for the confirmation link
2. **Click the link** to confirm your account
3. **Then sign in** normally

## Current Status

- ✅ **Google Sign-In:** Working (uses mock auth in dev)
- ❌ **Email/Password Sign-Up:** Requires email confirmation
- ✅ **Email/Password Sign-In:** Should work after confirmation

## Recommendation

**For development testing, use Google Sign-In** - it's already working perfectly and doesn't require email confirmation.

## Production Notes

In production, you'll want to:
- Keep email confirmation enabled for security
- Use the proper Google OAuth (not mock auth)
- Handle the confirmation flow properly
