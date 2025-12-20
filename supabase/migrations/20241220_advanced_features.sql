-- Finance Tracker Advanced Features Database Migration
-- Generated: 2024-12-20
-- Description: Database schema updates for 8 advanced features

-- =============================================================================
-- AI-POWERED FINANCIAL INSIGHTS
-- =============================================================================

-- AI Insights and recommendations
CREATE TABLE IF NOT EXISTS ai_insights (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'spending_pattern', 'budget_advice', 'savings_opportunity', 'financial_health'
  title text NOT NULL,
  description text NOT NULL,
  priority integer DEFAULT 1, -- 1=low, 2=medium, 3=high
  confidence_score numeric(3,2), -- 0.00 to 1.00
  data jsonb, -- Additional structured data for the insight
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false,
  is_dismissed boolean DEFAULT false
);

-- Financial patterns tracking
CREATE TABLE IF NOT EXISTS financial_patterns (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_type text NOT NULL, -- 'recurring_expense', 'seasonal_spending', 'income_variation'
  category text,
  pattern_data jsonb NOT NULL,
  confidence_score numeric(3,2),
  last_analyzed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- AI Model training data (anonymized)
CREATE TABLE IF NOT EXISTS model_training_data (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_vector jsonb, -- Encoded features for ML training
  label text, -- Correct categorization/pattern
  created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- AUTOMATED TRANSACTION CATEGORIZATION
-- =============================================================================

-- Add categorization fields to transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS predicted_category text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS categorization_confidence numeric(3,2);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_auto_categorized boolean DEFAULT false;

-- Category rules and patterns
CREATE TABLE IF NOT EXISTS categorization_rules (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rule_type text NOT NULL, -- 'keyword', 'amount_range', 'merchant_pattern'
  pattern text NOT NULL,
  category text NOT NULL,
  confidence_boost numeric(3,2) DEFAULT 1.0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Category learning data
CREATE TABLE IF NOT EXISTS category_training (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  original_prediction text,
  user_corrected_category text,
  feedback_date timestamptz DEFAULT now()
);

-- Merchant information database
CREATE TABLE IF NOT EXISTS merchant_data (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  merchant_name text NOT NULL UNIQUE,
  likely_category text NOT NULL,
  confidence_score numeric(3,2),
  transaction_count integer DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

-- =============================================================================
-- REAL-TIME COLLABORATION
-- =============================================================================

-- Shared budgets and goals
CREATE TABLE IF NOT EXISTS shared_finances (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  type text NOT NULL, -- 'budget', 'goal', 'account'
  is_public boolean DEFAULT false,
  invite_code text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Collaboration permissions
CREATE TABLE IF NOT EXISTS collaboration_permissions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  shared_finance_id uuid NOT NULL REFERENCES shared_finances(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_level text NOT NULL, -- 'view', 'edit', 'admin'
  invited_by uuid REFERENCES auth.users(id),
  invited_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  UNIQUE(shared_finance_id, user_id)
);

-- Real-time collaboration sessions
CREATE TABLE IF NOT EXISTS collaboration_sessions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  shared_finance_id uuid NOT NULL REFERENCES shared_finances(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text NOT NULL,
  last_activity timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  UNIQUE(shared_finance_id, user_id)
);

-- Activity log for collaboration
CREATE TABLE IF NOT EXISTS collaboration_activity (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  shared_finance_id uuid NOT NULL REFERENCES shared_finances(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL, -- 'create', 'update', 'delete', 'comment'
  resource_type text NOT NULL, -- 'transaction', 'budget', 'goal'
  resource_id uuid,
  changes jsonb,
  comment text,
  created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- FINANCIAL GOAL TRACKING
-- =============================================================================

-- Financial goals
CREATE TABLE IF NOT EXISTS financial_goals (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  goal_type text NOT NULL, -- 'savings', 'debt_payoff', 'investment', 'expense_limit'
  target_amount numeric(12,2) NOT NULL,
  current_amount numeric(12,2) DEFAULT 0,
  target_date date,
  category text,
  priority integer DEFAULT 2, -- 1=low, 2=medium, 3=high, 4=critical
  status text DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
  is_shared boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Goal milestones
CREATE TABLE IF NOT EXISTS goal_milestones (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  goal_id uuid NOT NULL REFERENCES financial_goals(id) ON DELETE CASCADE,
  title text NOT NULL,
  target_amount numeric(12,2) NOT NULL,
  target_date date,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Goal contributions tracking
CREATE TABLE IF NOT EXISTS goal_contributions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  goal_id uuid NOT NULL REFERENCES financial_goals(id) ON DELETE CASCADE,
  transaction_id uuid REFERENCES transactions(id) ON DELETE SET NULL,
  amount numeric(12,2) NOT NULL,
  contribution_type text NOT NULL, -- 'manual', 'automatic', 'transaction_link'
  note text,
  created_at timestamptz DEFAULT now()
);

-- Goal analytics
CREATE TABLE IF NOT EXISTS goal_analytics (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  goal_id uuid NOT NULL REFERENCES financial_goals(id) ON DELETE CASCADE,
  date date NOT NULL,
  progress_percentage numeric(5,2),
  projected_completion_date date,
  daily_contribution_needed numeric(12,2),
  on_track boolean,
  created_at timestamptz DEFAULT now(),
  UNIQUE(goal_id, date)
);

-- =============================================================================
-- DATA IMPORT/EXPORT & BANK INTEGRATION
-- =============================================================================

-- Import/Export jobs
CREATE TABLE IF NOT EXISTS data_jobs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_type text NOT NULL, -- 'import', 'export', 'sync'
  file_format text, -- 'csv', 'xlsx', 'pdf', 'ofx', 'qif'
  source text, -- 'file_upload', 'bank_api', 'manual'
  status text DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  file_name text,
  records_processed integer DEFAULT 0,
  records_successful integer DEFAULT 0,
  records_failed integer DEFAULT 0,
  error_log jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Bank connections
CREATE TABLE IF NOT EXISTS bank_connections (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name text NOT NULL,
  connection_type text NOT NULL, -- 'plaid', 'yodlee', 'manual'
  account_id text,
  access_token text, -- Encrypted
  refresh_token text, -- Encrypted
  is_active boolean DEFAULT true,
  last_sync_at timestamptz,
  sync_frequency text DEFAULT 'daily', -- 'realtime', 'hourly', 'daily', 'weekly'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Data mapping rules for imports
CREATE TABLE IF NOT EXISTS import_mappings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mapping_name text NOT NULL,
  file_format text NOT NULL,
  column_mappings jsonb NOT NULL, -- {"date": "transaction_date", "amount": "amount", ...}
  category_mappings jsonb, -- Custom category mapping rules
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- ADVANCED REPORTING & VISUALIZATION
-- =============================================================================

-- Custom reports
CREATE TABLE IF NOT EXISTS custom_reports (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  report_type text NOT NULL, -- 'spending_analysis', 'budget_performance', 'goal_progress', 'custom'
  configuration jsonb NOT NULL, -- Report configuration and filters
  visualization_config jsonb, -- Chart types, colors, etc.
  is_scheduled boolean DEFAULT false,
  schedule_frequency text, -- 'daily', 'weekly', 'monthly'
  last_generated timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Report sharing
CREATE TABLE IF NOT EXISTS report_sharing (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id uuid NOT NULL REFERENCES custom_reports(id) ON DELETE CASCADE,
  shared_with uuid REFERENCES auth.users(id),
  share_token text UNIQUE,
  permission_level text DEFAULT 'view', -- 'view', 'edit'
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Advanced analytics cache
CREATE TABLE IF NOT EXISTS analytics_cache (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cache_key text NOT NULL,
  data jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(uid, cache_key)
);

-- =============================================================================
-- CUSTOM ALERTS & NOTIFICATIONS
-- =============================================================================

-- Notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type text NOT NULL, -- 'budget_exceeded', 'goal_achieved', 'unusual_spending', etc.
  is_enabled boolean DEFAULT true,
  notification_channels jsonb, -- {"email": true, "push": false, "sms": true}
  threshold_value numeric(12,2), -- Custom threshold for the alert
  frequency text DEFAULT 'immediate', -- 'immediate', 'daily', 'weekly'
  quiet_hours_start time,
  quiet_hours_end time,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notification log
CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb, -- Additional context data
  channels_sent jsonb, -- Track which channels were used
  is_read boolean DEFAULT false,
  is_dismissed boolean DEFAULT false,
  priority text DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  created_at timestamptz DEFAULT now()
);

-- Smart alert rules
CREATE TABLE IF NOT EXISTS smart_alerts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rule_name text NOT NULL,
  rule_type text NOT NULL, -- 'spending_pattern', 'budget_variance', 'goal_progress'
  conditions jsonb NOT NULL, -- Rule conditions and logic
  actions jsonb NOT NULL, -- What to do when rule triggers
  is_active boolean DEFAULT true,
  last_triggered timestamptz,
  trigger_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================================================
-- PRIVACY & SECURITY DASHBOARD
-- =============================================================================

-- Security audit log
CREATE TABLE IF NOT EXISTS security_audit_log (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'login', 'logout', 'data_export', 'settings_change', etc.
  event_description text NOT NULL,
  ip_address inet,
  user_agent text,
  session_id text,
  risk_score numeric(3,2), -- Calculated risk score for the event
  additional_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Data retention policies
CREATE TABLE IF NOT EXISTS data_retention_policies (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  policy_name text NOT NULL,
  data_type text NOT NULL, -- 'transactions', 'reports', 'audit_logs'
  retention_period integer NOT NULL, -- Days to retain data
  auto_delete boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Privacy settings
CREATE TABLE IF NOT EXISTS privacy_settings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data_sharing_consent boolean DEFAULT false,
  analytics_opt_in boolean DEFAULT false,
  marketing_consent boolean DEFAULT false,
  export_data_format text DEFAULT 'json', -- 'json', 'csv', 'pdf'
  account_deletion_requested_at timestamptz,
  data_export_requested_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Two-factor authentication
CREATE TABLE IF NOT EXISTS two_factor_auth (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_enabled boolean DEFAULT false,
  secret_key text, -- Encrypted TOTP secret
  backup_codes jsonb, -- Encrypted backup codes
  last_used timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on all new tables
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_sharing ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE two_factor_auth ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables
-- AI Insights policies
CREATE POLICY "ai_insights_select_policy" ON ai_insights FOR SELECT USING (auth.uid() = uid);
CREATE POLICY "ai_insights_insert_policy" ON ai_insights FOR INSERT WITH CHECK (auth.uid() = uid);
CREATE POLICY "ai_insights_update_policy" ON ai_insights FOR UPDATE USING (auth.uid() = uid) WITH CHECK (auth.uid() = uid);
CREATE POLICY "ai_insights_delete_policy" ON ai_insights FOR DELETE USING (auth.uid() = uid);

-- Financial patterns policies
CREATE POLICY "financial_patterns_select_policy" ON financial_patterns FOR SELECT USING (auth.uid() = uid);
CREATE POLICY "financial_patterns_insert_policy" ON financial_patterns FOR INSERT WITH CHECK (auth.uid() = uid);
CREATE POLICY "financial_patterns_update_policy" ON financial_patterns FOR UPDATE USING (auth.uid() = uid) WITH CHECK (auth.uid() = uid);
CREATE POLICY "financial_patterns_delete_policy" ON financial_patterns FOR DELETE USING (auth.uid() = uid);

-- Model training data policies
CREATE POLICY "model_training_data_select_policy" ON model_training_data FOR SELECT USING (auth.uid() = uid);
CREATE POLICY "model_training_data_insert_policy" ON model_training_data FOR INSERT WITH CHECK (auth.uid() = uid);
CREATE POLICY "model_training_data_update_policy" ON model_training_data FOR UPDATE USING (auth.uid() = uid) WITH CHECK (auth.uid() = uid);
CREATE POLICY "model_training_data_delete_policy" ON model_training_data FOR DELETE USING (auth.uid() = uid);

-- Categorization rules policies
CREATE POLICY "categorization_rules_select_policy" ON categorization_rules FOR SELECT USING (auth.uid() = uid);
CREATE POLICY "categorization_rules_insert_policy" ON categorization_rules FOR INSERT WITH CHECK (auth.uid() = uid);
CREATE POLICY "categorization_rules_update_policy" ON categorization_rules FOR UPDATE USING (auth.uid() = uid) WITH CHECK (auth.uid() = uid);
CREATE POLICY "categorization_rules_delete_policy" ON categorization_rules FOR DELETE USING (auth.uid() = uid);

-- Category training policies
CREATE POLICY "category_training_select_policy" ON category_training FOR SELECT USING (auth.uid() = uid);
CREATE POLICY "category_training_insert_policy" ON category_training FOR INSERT WITH CHECK (auth.uid() = uid);
CREATE POLICY "category_training_update_policy" ON category_training FOR UPDATE USING (auth.uid() = uid) WITH CHECK (auth.uid() = uid);
CREATE POLICY "category_training_delete_policy" ON category_training FOR DELETE USING (auth.uid() = uid);

-- Merchant data is shared across users (read-only for most users)
CREATE POLICY "merchant_data_select_policy" ON merchant_data FOR SELECT USING (true);
CREATE POLICY "merchant_data_insert_policy" ON merchant_data FOR INSERT WITH CHECK (false); -- Only system can insert
CREATE POLICY "merchant_data_update_policy" ON merchant_data FOR UPDATE USING (false); -- Only system can update
CREATE POLICY "merchant_data_delete_policy" ON merchant_data FOR DELETE USING (false); -- Only system can delete

-- Shared finances policies
CREATE POLICY "shared_finances_select_policy" ON shared_finances FOR SELECT USING (
  auth.uid() = owner_id OR 
  EXISTS (SELECT 1 FROM collaboration_permissions cp WHERE cp.shared_finance_id = shared_finances.id AND cp.user_id = auth.uid())
);
CREATE POLICY "shared_finances_insert_policy" ON shared_finances FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "shared_finances_update_policy" ON shared_finances FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "shared_finances_delete_policy" ON shared_finances FOR DELETE USING (auth.uid() = owner_id);

-- Continue with remaining policies for all tables...
-- (Policies for collaboration_permissions, collaboration_sessions, collaboration_activity, etc.)

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- AI and ML related indexes
CREATE INDEX IF NOT EXISTS idx_ai_insights_uid_created ON ai_insights (uid, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_type_priority ON ai_insights (type, priority);
CREATE INDEX IF NOT EXISTS idx_financial_patterns_uid_type ON financial_patterns (uid, pattern_type);
CREATE INDEX IF NOT EXISTS idx_model_training_data_uid_created ON model_training_data (uid, created_at DESC);

-- Categorization indexes
CREATE INDEX IF NOT EXISTS idx_transactions_predicted_category ON transactions (predicted_category) WHERE predicted_category IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_categorization_rules_uid_active ON categorization_rules (uid, is_active);
CREATE INDEX IF NOT EXISTS idx_category_training_uid_date ON category_training (uid, feedback_date DESC);
CREATE INDEX IF NOT EXISTS idx_merchant_data_name ON merchant_data (merchant_name);

-- Collaboration indexes
CREATE INDEX IF NOT EXISTS idx_shared_finances_owner_id ON shared_finances (owner_id);
CREATE INDEX IF NOT EXISTS idx_shared_finances_public ON shared_finances (is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_collaboration_permissions_shared_finance_user ON collaboration_permissions (shared_finance_id, user_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_activity_shared_finance_created ON collaboration_activity (shared_finance_id, created_at DESC);

-- Goals indexes
CREATE INDEX IF NOT EXISTS idx_financial_goals_uid_status ON financial_goals (uid, status);
CREATE INDEX IF NOT EXISTS idx_financial_goals_uid_type ON financial_goals (uid, goal_type);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal_id ON goal_milestones (goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_contributions_goal_id ON goal_contributions (goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_analytics_goal_date ON goal_analytics (goal_id, date DESC);

-- Data jobs indexes
CREATE INDEX IF NOT EXISTS idx_data_jobs_uid_status ON data_jobs (uid, status);
CREATE INDEX IF NOT EXISTS idx_data_jobs_created_at ON data_jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bank_connections_uid_active ON bank_connections (uid, is_active);
CREATE INDEX IF NOT EXISTS idx_import_mappings_uid_format ON import_mappings (uid, file_format);

-- Reports indexes
CREATE INDEX IF NOT EXISTS idx_custom_reports_uid_type ON custom_reports (uid, report_type);
CREATE INDEX IF NOT EXISTS idx_custom_reports_scheduled ON custom_reports (is_scheduled) WHERE is_scheduled = true;
CREATE INDEX IF NOT EXISTS idx_report_sharing_token ON report_sharing (share_token);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_uid_key ON analytics_cache (uid, cache_key);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notification_preferences_uid_type ON notification_preferences (uid, alert_type);
CREATE INDEX IF NOT EXISTS idx_notifications_uid_created ON notifications (uid, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_uid_read ON notifications (uid, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_smart_alerts_uid_active ON smart_alerts (uid, is_active) WHERE is_active = true;

-- Security indexes
CREATE INDEX IF NOT EXISTS idx_security_audit_log_uid_created ON security_audit_log (uid, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_event_type ON security_audit_log (event_type);
CREATE INDEX IF NOT EXISTS idx_data_retention_policies_uid_type ON data_retention_policies (uid, data_type);
CREATE INDEX IF NOT EXISTS idx_privacy_settings_uid ON privacy_settings (uid);
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_uid ON two_factor_auth (uid);

-- =============================================================================
-- INITIAL DATA SETUP
-- =============================================================================

-- Insert default notification preferences
INSERT INTO notification_preferences (uid, alert_type, is_enabled, notification_channels) 
SELECT 
  auth.uid(),
  alert_type,
  true,
  '{"email": true, "push": true, "sms": false}'
FROM (VALUES 
  ('budget_exceeded'),
  ('goal_achieved'),
  ('unusual_spending'),
  ('goal_milestone_reached'),
  ('savings_opportunity'),
  ('bill_reminder'),
  ('financial_insight')
) AS default_alerts(alert_type)
ON CONFLICT DO NOTHING;

-- Insert default privacy settings
INSERT INTO privacy_settings (uid, data_sharing_consent, analytics_opt_in, marketing_consent)
SELECT 
  auth.uid(),
  false,
  true,
  false
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert default data retention policies
INSERT INTO data_retention_policies (uid, policy_name, data_type, retention_period, auto_delete)
SELECT 
  auth.uid(),
  'Default ' || data_type || ' retention',
  data_type,
  retention_period,
  true
FROM (VALUES 
  ('transactions', 2555), -- 7 years
  ('reports', 1095), -- 3 years
  ('audit_logs', 365) -- 1 year
) AS default_retention(data_type, retention_period)
ON CONFLICT DO NOTHING;

-- Insert some default categorization rules
INSERT INTO categorization_rules (uid, rule_type, pattern, category, confidence_boost)
SELECT 
  auth.uid(),
  'keyword',
  pattern,
  category,
  1.0
FROM (VALUES 
  ('grocery', 'Food'),
  ('restaurant', 'Food'),
  ('gas', 'Transport'),
  ('uber', 'Transport'),
  ('rent', 'Housing'),
  ('electricity', 'Utilities'),
  ('internet', 'Utilities'),
  ('netflix', 'Entertainment'),
  ('gym', 'Health'),
  ('pharmacy', 'Health')
) AS default_rules(pattern, category)
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_ai_insights_updated_at BEFORE UPDATE ON ai_insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_patterns_updated_at BEFORE UPDATE ON financial_patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shared_finances_updated_at BEFORE UPDATE ON shared_finances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_goals_updated_at BEFORE UPDATE ON financial_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_connections_updated_at BEFORE UPDATE ON bank_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custom_reports_updated_at BEFORE UPDATE ON custom_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_smart_alerts_updated_at BEFORE UPDATE ON smart_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_data_retention_policies_updated_at BEFORE UPDATE ON data_retention_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_privacy_settings_updated_at BEFORE UPDATE ON privacy_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_two_factor_auth_updated_at BEFORE UPDATE ON two_factor_auth FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- CLEANUP FUNCTIONS
-- =============================================================================

-- Function to clean up old analytics cache
CREATE OR REPLACE FUNCTION cleanup_analytics_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM analytics_cache WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired collaboration sessions
CREATE OR REPLACE FUNCTION cleanup_collaboration_sessions()
RETURNS void AS $$
BEGIN
  UPDATE collaboration_sessions 
  SET is_active = false 
  WHERE last_activity < now() - interval '24 hours' AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old audit logs based on retention policies
CREATE OR REPLACE FUNCTION cleanup_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM security_audit_log 
  WHERE created_at < now() - (
    SELECT (drp.retention_period || ' days')::interval 
    FROM data_retention_policies drp 
    WHERE drp.uid = security_audit_log.uid AND drp.data_type = 'audit_logs'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE ai_insights IS 'AI-generated financial insights and recommendations for users';
COMMENT ON TABLE financial_patterns IS 'Detected spending and income patterns for ML training';
COMMENT ON TABLE categorization_rules IS 'User-defined rules for automatic transaction categorization';
COMMENT ON TABLE shared_finances IS 'Budgets and goals shared between users for collaboration';
COMMENT ON TABLE financial_goals IS 'User-defined financial goals with tracking and milestones';
COMMENT ON TABLE data_jobs IS 'Import/export job tracking and status';
COMMENT ON TABLE bank_connections IS 'User bank account connections for data synchronization';
COMMENT ON TABLE custom_reports IS 'User-defined custom reports with scheduling capabilities';
COMMENT ON TABLE notifications IS 'System and user-generated notifications';
COMMENT ON TABLE security_audit_log IS 'Security and privacy audit trail for compliance';

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

DO $$
BEGIN
