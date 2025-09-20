-- Resend Email Integration Database Setup
-- Run this in your Supabase SQL Editor

-- Create email logs table for tracking Resend emails
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL, -- 'signup_confirmation', 'password_reset', 'welcome_email', 'receipt_notification', 'referral_notification'
    message_id VARCHAR(255) NOT NULL, -- Resend message ID
    recipient_email VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    provider VARCHAR(50) DEFAULT 'resend',
    status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'delivered', 'bounced', 'failed'
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_message_id ON email_logs(message_id);

-- Enable Row Level Security
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own email logs" ON email_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all email logs" ON email_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_email_logs_updated_at 
    BEFORE UPDATE ON email_logs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to get email statistics
CREATE OR REPLACE FUNCTION get_email_stats(user_id_param UUID DEFAULT NULL)
RETURNS TABLE (
    email_type VARCHAR(50),
    total_sent BIGINT,
    successful_sent BIGINT,
    failed_sent BIGINT,
    success_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        el.email_type,
        COUNT(*) as total_sent,
        COUNT(*) FILTER (WHERE el.status IN ('sent', 'delivered')) as successful_sent,
        COUNT(*) FILTER (WHERE el.status IN ('bounced', 'failed')) as failed_sent,
        ROUND(
            (COUNT(*) FILTER (WHERE el.status IN ('sent', 'delivered'))::NUMERIC / COUNT(*)::NUMERIC) * 100, 
            2
        ) as success_rate
    FROM email_logs el
    WHERE (user_id_param IS NULL OR el.user_id = user_id_param)
    GROUP BY el.email_type
    ORDER BY el.email_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get recent email activity
CREATE OR REPLACE FUNCTION get_recent_email_activity(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
    date_sent DATE,
    email_type VARCHAR(50),
    count_sent BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(el.sent_at) as date_sent,
        el.email_type,
        COUNT(*) as count_sent
    FROM email_logs el
    WHERE el.sent_at >= NOW() - INTERVAL '1 day' * days_back
    GROUP BY DATE(el.sent_at), el.email_type
    ORDER BY date_sent DESC, el.email_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON email_logs TO authenticated;
GRANT ALL ON email_logs TO service_role;
GRANT EXECUTE ON FUNCTION get_email_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_email_activity TO authenticated;

-- Insert some sample data for testing (optional)
-- INSERT INTO email_logs (user_id, email_type, message_id, recipient_email, status) VALUES
-- ('00000000-0000-0000-0000-000000000000', 'test_email', 'test-message-id', 'test@example.com', 'sent');

COMMENT ON TABLE email_logs IS 'Tracks all emails sent through Resend integration';
COMMENT ON COLUMN email_logs.email_type IS 'Type of email: signup_confirmation, password_reset, welcome_email, receipt_notification, referral_notification';
COMMENT ON COLUMN email_logs.message_id IS 'Resend message ID for tracking delivery status';
COMMENT ON COLUMN email_logs.status IS 'Email delivery status: sent, delivered, bounced, failed';

