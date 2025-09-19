-- CRITICAL FIX: Add missing get_user_credits function
-- Run this in your Supabase SQL Editor

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
      WHEN u.subscription_status IN ('premium', 'founder', 'yearly') THEN TRUE
      WHEN u.subscription_status = 'emergency' AND u.credits_remaining > 0 THEN TRUE
      WHEN u.subscription_status = 'free' AND u.last_free_receipt_date < CURRENT_DATE THEN TRUE
      ELSE FALSE
    END as can_generate_receipt
  FROM public.users u
  WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_user_credits(UUID) TO authenticated;
