# Database Migration Plan for Advanced Features

## Migration Script Overview

This document contains the comprehensive database migration script that needs to be executed in Supabase to support all 8 advanced features.

## Key Database Changes

### 1. AI-Powered Financial Insights
- `ai_insights` - AI-generated recommendations and insights
- `financial_patterns` - Detected spending patterns
- `model_training_data` - ML training data (anonymized)

### 2. Automated Transaction Categorization  
- Added columns to `transactions`: `predicted_category`, `categorization_confidence`, `is_auto_categorized`
- `categorization_rules` - User-defined categorization rules
- `category_training` - Feedback for ML improvement
- `merchant_data` - Shared merchant information database

### 3. Real-Time Collaboration
- `shared_finances` - Shared budgets and goals
- `collaboration_permissions` - User permissions for shared resources
- `collaboration_sessions` - Active collaboration sessions
- `collaboration_activity` - Activity audit log

### 4. Financial Goal Tracking
- `financial_goals` - Comprehensive goal management
- `goal_milestones` - Goal milestones and achievements
- `goal_contributions` - Track goal contributions
- `goal_analytics` - Goal performance analytics

### 5. Data Import/Export & Bank Integration
- `data_jobs` - Import/export job tracking
- `bank_connections` - Bank API connections
- `import_mappings` - Data mapping rules

### 6. Advanced Reporting & Visualization
- `custom_reports` - User-defined reports
- `report_sharing` - Report sharing capabilities
- `analytics_cache` - Cached analytics for performance

### 7. Custom Alerts & Notifications
- `notification_preferences` - User notification settings
- `notifications` - Notification log
- `smart_alerts` - Configurable alert rules

### 8. Privacy & Security Dashboard
- `security_audit_log` - Security audit trail
- `data_retention_policies` - Data retention settings
- `privacy_settings` - Privacy preferences
- `two_factor_auth` - 2FA configuration

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring users can only access their own data, with special handling for shared resources.

### Performance Optimization
- Strategic indexes on commonly queried columns
- Composite indexes for complex queries
- Cleanup functions for maintenance

## Execution Instructions

1. **Backup Current Database**
   ```sql
   -- Create backup before migration
   pg_dump -h your-host -U postgres -d your-database > backup.sql
   ```

2. **Execute Migration Script**
   ```sql
   -- Run the complete migration script in Supabase SQL editor
   -- File: supabase/migrations/20241220_advanced_features.sql
   ```

3. **Verify Migration**
   ```sql
   -- Check all tables were created
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name LIKE '%ai_insights%' OR table_name LIKE '%financial_goals%' 
   -- ... other feature tables
   ```

4. **Test RLS Policies**
   ```sql
   -- Verify RLS is working correctly
   SELECT * FROM ai_insights WHERE uid = auth.uid();
   ```

## Rollback Plan

If issues arise, use this rollback script:

```sql
-- Drop all new tables (reverse order due to foreign keys)
DROP TABLE IF EXISTS two_factor_auth CASCADE;
DROP TABLE IF EXISTS privacy_settings CASCADE;
DROP TABLE IF EXISTS data_retention_policies CASCADE;
DROP TABLE IF EXISTS security_audit_log CASCADE;
DROP TABLE IF EXISTS smart_alerts CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS analytics_cache CASCADE;
DROP TABLE IF EXISTS report_sharing CASCADE;
DROP TABLE IF EXISTS custom_reports CASCADE;
DROP TABLE IF EXISTS import_mappings CASCADE;
DROP TABLE IF EXISTS bank_connections CASCADE;
DROP TABLE IF EXISTS data_jobs CASCADE;
DROP TABLE IF EXISTS goal_analytics CASCADE;
DROP TABLE IF EXISTS goal_contributions CASCADE;
DROP TABLE IF EXISTS goal_milestones CASCADE;
DROP TABLE IF EXISTS financial_goals CASCADE;
DROP TABLE IF EXISTS collaboration_activity CASCADE;
DROP TABLE IF EXISTS collaboration_sessions CASCADE;
DROP TABLE IF EXISTS collaboration_permissions CASCADE;
DROP TABLE IF EXISTS shared_finances CASCADE;
DROP TABLE IF EXISTS merchant_data CASCADE;
DROP TABLE IF EXISTS category_training CASCADE;
DROP TABLE IF EXISTS categorization_rules CASCADE;
DROP TABLE IF EXISTS model_training_data CASCADE;
DROP TABLE IF EXISTS financial_patterns CASCADE;
DROP TABLE IF EXISTS ai_insights CASCADE;

-- Remove added columns from transactions
ALTER TABLE transactions DROP COLUMN IF EXISTS predicted_category;
ALTER TABLE transactions DROP COLUMN IF EXISTS categorization_confidence;
ALTER TABLE transactions DROP COLUMN IF EXISTS is_auto_categorized;
```

## Monitoring and Maintenance

### Regular Cleanup Tasks
- Run `cleanup_analytics_cache()` daily
- Run `cleanup_collaboration_sessions()` daily  
- Run `cleanup_audit_logs()` weekly

### Performance Monitoring
- Monitor query performance on new tables
- Check index usage statistics
- Monitor RLS policy performance

## Data Migration Considerations

### Existing Data
- All existing data in `transactions` and `budgets` tables will be preserved
- New columns in `transactions` will be NULL initially
- Default preferences will be created for existing users

### Backward Compatibility
- All existing API endpoints will continue to work
- New features are additive only
- No breaking changes to existing functionality

## Testing Strategy

1. **Unit Tests**: Test each table creation and RLS policy
2. **Integration Tests**: Test foreign key relationships
3. **Performance Tests**: Verify query performance with indexes
4. **Security Tests**: Verify RLS policies work correctly
5. **Migration Tests**: Test migration and rollback procedures

## Deployment Checklist

- [ ] Backup production database
- [ ] Test migration on staging environment
- [ ] Execute migration during maintenance window
- [ ] Verify all tables created successfully
- [ ] Test RLS policies
- [ ] Monitor performance impact
- [ ] Update documentation
- [ ] Notify team of completion