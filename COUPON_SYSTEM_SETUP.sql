-- Simple Coupon System Setup
-- Based on the CSV file with viral-ready coupon names

-- 1. Create coupon codes table
CREATE TABLE coupon_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  coupon_name VARCHAR(100) NOT NULL,
  tier VARCHAR(20) NOT NULL, -- 'Basic' or 'Premium'
  receipts_count INTEGER NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  max_uses INTEGER DEFAULT 100, -- Usage limit
  usage_count INTEGER DEFAULT 0, -- How many times used
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 2. Create coupon usage tracking table
CREATE TABLE coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  coupon_code VARCHAR(50) REFERENCES coupon_codes(code),
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Insert some popular coupon codes from the CSV
INSERT INTO coupon_codes (code, coupon_name, tier, receipts_count, is_premium, max_uses) VALUES
-- Premium Receipts (5 credits)
('CASAAMOR3', 'Casa Amor 3', 'Basic', 3, false, 100),
('VIPVILLA5', 'VIP Villa 5', 'Premium', 5, true, 50),
('FINALROSE', 'The Final Rose', 'Premium', 3, true, 75),
('LOVEBOMB5', 'Love Bomb Loot', 'Basic', 5, false, 100),
('KDRAMA3', 'K-Drama Cliffhanger', 'Basic', 3, false, 100),
('BINGED5', 'Binged But Betrayed', 'Premium', 5, true, 50),
('SEASON2', 'Season 2 Energy', 'Premium', 3, true, 75),
('GHOSTED3', 'Ghosted 3', 'Basic', 3, false, 100),
('GREENFLAG5', 'Green Flag Audit', 'Premium', 5, true, 50),
('WTF3', 'WTF Was That Text?', 'Premium', 3, true, 75),
('FRIDAY5', 'Friday Night Receipts', 'Premium', 5, true, 50),
('UNI3', 'Uni Survival Kit', 'Basic', 3, false, 100),
('CUFFING5', 'Cuffing Season Credits', 'Premium', 5, true, 50),
('EXAM3', 'Exam Week Spiral', 'Premium', 3, true, 75),
('CAFE5', 'Cafeteria Confessions', 'Basic', 5, false, 100),
('RETRO3', 'Retrograde Pack', 'Basic', 3, false, 100),
('VENUS5', 'Venus Rx Special', 'Premium', 5, true, 50),
('MOON3', 'Moon Feelings 3', 'Basic', 3, false, 100),
('K3', 'k. Pack', 'Basic', 3, false, 100),
('WEIRD5', 'Don''t Be Weird 5', 'Premium', 5, true, 50),
('YOUUP3', 'You Up?', 'Basic', 3, false, 100),
('REDFLAG5', 'Red Flag Starter Pack', 'Premium', 5, true, 50),
('FRESHERS3', 'Freshers'' FOMO', 'Basic', 3, false, 100),
('DORM5', 'Dorm Room Diaries', 'Basic', 5, false, 100),
('TUTE3', 'Tute Group Red Flags', 'Basic', 3, false, 100),
('LECTURE3', 'Late Lecture Lurker', 'Premium', 3, true, 75),
('FINALS3', 'Finals Week Delulu Drop', 'Basic', 3, false, 100),
('CRUSH5', 'Crush Confusion Pack', 'Premium', 5, true, 50),
('BESTIE5', 'Bestie… Run.', 'Premium', 5, true, 50),
('AUDACITY5', 'The Audacity Drop', 'Premium', 5, true, 50),
('OLYMPICS5', 'Emotional Olympics', 'Premium', 5, true, 50),
('DELULU5', 'Delulu Gold Pack', 'Premium', 5, true, 50),
('LOVEISLAND3', 'Love Island Loyalty Test', 'Premium', 3, true, 75),
('EUPHORIA5', 'Euphoria Mode', 'Premium', 5, true, 50),
('TOOHOT3', 'Too Hot To Text', 'Premium', 3, true, 75),
('SAGE5', 'Sage vs. The Bachelorette', 'Premium', 5, true, 50),
('BEREAL3', 'Broke Up Over BeReal', 'Basic', 3, false, 100),
('LECTURE3', 'Lecture Left on Read', 'Basic', 3, false, 100),
('CAFE5', 'Cafeteria Crush Crisis', 'Basic', 5, false, 100),
('FRIEND5', 'Friend Zone Finals', 'Premium', 5, true, 50),
('DOUBLE3', 'Double Text Drag', 'Premium', 3, true, 75),
('SCREENSHOT3', 'Screenshot & Send', 'Premium', 3, true, 75),
('GHOST5', 'Ghost or Grow Up', 'Premium', 5, true, 50),
('SASS3', 'Sage''s Sass Sampler', 'Premium', 3, true, 75),
('DRAGGING5', 'Dragging Season', 'Premium', 5, true, 50),
('SIMP3', 'Simp Season Cancelled', 'Basic', 3, false, 100),
('BREADCRUMBS5', 'Breadcrumbs Burnout', 'Premium', 5, true, 50);

-- 4. Create index for faster lookups
CREATE INDEX idx_coupon_codes_code ON coupon_codes(code);
CREATE INDEX idx_coupon_usage_user_id ON coupon_usage(user_id);
CREATE INDEX idx_coupon_usage_code ON coupon_usage(coupon_code);

-- 5. Enable RLS
ALTER TABLE coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- 6. Create policies
CREATE POLICY "Anyone can read active coupons" ON coupon_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Users can read their own usage" ON coupon_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own usage" ON coupon_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Function to redeem coupon
CREATE OR REPLACE FUNCTION redeem_coupon(coupon_code_input VARCHAR(50), user_id_input UUID)
RETURNS JSON AS $$
DECLARE
  coupon_record coupon_codes%ROWTYPE;
  usage_count INTEGER;
  result JSON;
BEGIN
  -- Check if coupon exists and is active
  SELECT * INTO coupon_record 
  FROM coupon_codes 
  WHERE code = coupon_code_input AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid coupon code');
  END IF;
  
  -- Check if user already used this coupon
  SELECT COUNT(*) INTO usage_count
  FROM coupon_usage 
  WHERE user_id = user_id_input AND coupon_code = coupon_code_input;
  
  IF usage_count > 0 THEN
    RETURN json_build_object('success', false, 'error', 'You have already used this coupon');
  END IF;
  
  -- Check if coupon has remaining uses
  IF coupon_record.usage_count >= coupon_record.max_uses THEN
    RETURN json_build_object('success', false, 'error', 'This coupon has reached its usage limit');
  END IF;
  
  -- Check if coupon is expired
  IF coupon_record.expires_at IS NOT NULL AND coupon_record.expires_at < NOW() THEN
    RETURN json_build_object('success', false, 'error', 'This coupon has expired');
  END IF;
  
  -- Record the usage
  INSERT INTO coupon_usage (user_id, coupon_code) VALUES (user_id_input, coupon_code_input);
  
  -- Update usage count
  UPDATE coupon_codes 
  SET usage_count = usage_count + 1 
  WHERE code = coupon_code_input;
  
  -- Return success with coupon details
  RETURN json_build_object(
    'success', true,
    'coupon_name', coupon_record.coupon_name,
    'receipts_count', coupon_record.receipts_count,
    'is_premium', coupon_record.is_premium,
    'remaining_uses', coupon_record.max_uses - (coupon_record.usage_count + 1)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
