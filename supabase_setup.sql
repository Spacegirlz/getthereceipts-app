-- GetTheReceipts Supabase Database Schema
-- Run these commands in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  stripe_customer_id VARCHAR UNIQUE,
  subscription_status VARCHAR DEFAULT 'free' CHECK (subscription_status IN ('free', 'emergency', 'premium', 'founder')),
  subscription_plan VARCHAR,
  stripe_subscription_id VARCHAR,
  credits_remaining INTEGER DEFAULT 1,
  total_receipts_generated INTEGER DEFAULT 0,
  last_free_receipt_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Truth receipts storage
CREATE TABLE public.receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  analysis_result JSONB,
  receipt_type VARCHAR DEFAULT 'truth' CHECK (receipt_type IN ('truth', 'emergency')),
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription events for audit trail
CREATE TABLE public.subscription_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  event_type VARCHAR NOT NULL CHECK (event_type IN ('created', 'updated', 'cancelled', 'reactivated')),
  stripe_event_id VARCHAR,
  subscription_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_stripe_customer_id ON public.users(stripe_customer_id);
CREATE INDEX idx_users_subscription_status ON public.users(subscription_status);
CREATE INDEX idx_receipts_user_id ON public.receipts(user_id);
CREATE INDEX idx_receipts_created_at ON public.receipts(created_at);
CREATE INDEX idx_subscription_events_user_id ON public.subscription_events(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Receipts policies
CREATE POLICY "Users can view own receipts" ON public.receipts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own receipts" ON public.receipts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscription events are read-only for users
CREATE POLICY "Users can view own subscription events" ON public.subscription_events
  FOR SELECT USING (auth.uid() = user_id);

-- Functions for user management
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check user credits
CREATE OR REPLACE FUNCTION public.get_user_credits(user_uuid UUID)
RETURNS TABLE (
  credits_remaining INTEGER,
  subscription_status VARCHAR,
  can_generate_receipt BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.credits_remaining,
    u.subscription_status,
    CASE 
      WHEN u.subscription_status IN ('premium', 'founder') THEN TRUE
      WHEN u.subscription_status = 'emergency' AND u.credits_remaining > 0 THEN TRUE
      WHEN u.subscription_status = 'free' AND u.last_free_receipt_date < CURRENT_DATE THEN TRUE
      ELSE FALSE
    END as can_generate_receipt
  FROM public.users u
  WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to consume credits
CREATE OR REPLACE FUNCTION public.consume_credit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
  can_generate BOOLEAN;
BEGIN
  -- Get user info and check if they can generate receipt
  SELECT * FROM public.get_user_credits(user_uuid) INTO user_record;
  
  IF NOT user_record.can_generate_receipt THEN
    RETURN FALSE;
  END IF;
  
  -- Update credits based on subscription type
  IF user_record.subscription_status = 'free' THEN
    UPDATE public.users 
    SET last_free_receipt_date = CURRENT_DATE,
        total_receipts_generated = total_receipts_generated + 1
    WHERE id = user_uuid;
  ELSIF user_record.subscription_status = 'emergency' THEN
    UPDATE public.users 
    SET credits_remaining = credits_remaining - 1,
        total_receipts_generated = total_receipts_generated + 1
    WHERE id = user_uuid;
  ELSE -- premium or founder
    UPDATE public.users 
    SET total_receipts_generated = total_receipts_generated + 1
    WHERE id = user_uuid;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add emergency pack credits
CREATE OR REPLACE FUNCTION public.add_emergency_credits(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users 
  SET credits_remaining = 5,
      subscription_status = 'emergency'
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update subscription status
CREATE OR REPLACE FUNCTION public.update_subscription_status(
  user_uuid UUID,
  new_status VARCHAR,
  stripe_sub_id VARCHAR DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users 
  SET subscription_status = new_status,
      stripe_subscription_id = COALESCE(stripe_sub_id, stripe_subscription_id),
      credits_remaining = CASE 
        WHEN new_status IN ('premium', 'founder') THEN 999999 -- Unlimited
        WHEN new_status = 'free' THEN 0
        ELSE credits_remaining
      END
  WHERE id = user_uuid;
  
  -- Log the event
  INSERT INTO public.subscription_events (user_id, event_type, subscription_data)
  VALUES (user_uuid, 'updated', jsonb_build_object(
    'status', new_status,
    'stripe_subscription_id', stripe_sub_id
  ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.receipts TO authenticated;
GRANT SELECT ON public.subscription_events TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_credits(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.consume_credit(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_emergency_credits(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_subscription_status(UUID, VARCHAR, VARCHAR) TO authenticated;