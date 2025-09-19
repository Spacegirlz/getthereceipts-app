-- CRITICAL FIX: Create missing subscription_events table
-- This table is essential for subscription monitoring and audit trails

-- 1. Create the subscription_events table
CREATE TABLE IF NOT EXISTS public.subscription_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  subscription_data JSONB,
  stripe_event_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id ON public.subscription_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_event_type ON public.subscription_events(event_type);
CREATE INDEX IF NOT EXISTS idx_subscription_events_created_at ON public.subscription_events(created_at);
CREATE INDEX IF NOT EXISTS idx_subscription_events_stripe_event_id ON public.subscription_events(stripe_event_id);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
CREATE POLICY "Users can view their own subscription events" ON public.subscription_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscription events" ON public.subscription_events
  FOR ALL USING (auth.role() = 'service_role');

-- 5. Create function to log subscription events
CREATE OR REPLACE FUNCTION public.log_subscription_event(
  user_uuid UUID,
  event_type_input VARCHAR(50),
  subscription_data_input JSONB DEFAULT NULL,
  stripe_event_id_input VARCHAR(255) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.subscription_events (
    user_id,
    event_type,
    subscription_data,
    stripe_event_id
  ) VALUES (
    user_uuid,
    event_type_input,
    subscription_data_input,
    stripe_event_id_input
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant permissions
GRANT EXECUTE ON FUNCTION public.log_subscription_event(UUID, VARCHAR, JSONB, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_subscription_event(UUID, VARCHAR, JSONB, VARCHAR) TO service_role;

-- 7. Create function to get subscription event history
CREATE OR REPLACE FUNCTION public.get_subscription_events(user_uuid UUID)
RETURNS TABLE (
  event_id UUID,
  event_type VARCHAR,
  subscription_data JSONB,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    se.id,
    se.event_type,
    se.subscription_data,
    se.created_at
  FROM public.subscription_events se
  WHERE se.user_id = user_uuid
  ORDER BY se.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant permissions for event history
GRANT EXECUTE ON FUNCTION public.get_subscription_events(UUID) TO authenticated;

-- 9. Insert some sample events for testing (optional)
-- Uncomment these lines if you want sample data
/*
INSERT INTO public.subscription_events (user_id, event_type, subscription_data) VALUES
  ('00000000-0000-0000-0000-000000000000', 'subscription_created', '{"plan": "premium", "amount": 6.99}'),
  ('00000000-0000-0000-0000-000000000000', 'payment_succeeded', '{"amount": 6.99, "currency": "usd"}'),
  ('00000000-0000-0000-0000-000000000000', 'subscription_renewed', '{"plan": "premium", "next_billing": "2025-10-17"}');
*/

-- 10. Verify the table was created
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'subscription_events' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- This creates:
-- ✅ subscription_events table with proper schema
-- ✅ Performance indexes
-- ✅ RLS policies for security
-- ✅ Functions for logging and retrieving events
-- ✅ Proper permissions
-- ✅ Sample data structure for testing
