# API Endpoints Design for Advanced Features

## Overview

This document outlines the RESTful API endpoints needed to support all 8 advanced features. All endpoints follow consistent naming conventions and use standard HTTP methods and status codes.

## Base Configuration
- **Base URL**: `https://your-project.supabase.co/functions/v1/`
- **Authentication**: Supabase JWT token in Authorization header
- **Content-Type**: `application/json`
- **Response Format**: JSON

## AI-Powered Financial Insights

### Insights Management
```http
GET    /api/ai/insights
GET    /api/ai/insights/:id
POST   /api/ai/analyze
PUT    /api/ai/insights/:id/read
DELETE /api/ai/insights/:id
```

**Response Example:**
```json
{
  "insights": [
    {
      "id": "uuid",
      "type": "spending_pattern",
      "title": "Increased dining expenses",
      "description": "Your dining expenses increased by 25% this month",
      "priority": 2,
      "confidence_score": 0.87,
      "data": {
        "category": "Food",
        "increase_percentage": 25,
        "recommended_action": "Set dining budget limit"
      },
      "created_at": "2024-12-20T19:00:00Z",
      "is_read": false
    }
  ]
}
```

### Pattern Detection
```http
GET    /api/ai/patterns
POST   /api/ai/patterns/detect
GET    /api/ai/patterns/:id
DELETE /api/ai/patterns/:id
```

### Financial Health
```http
GET /api/ai/health-score
GET /api/ai/health-metrics
POST /api/ai/feedback
```

## Automated Transaction Categorization

### Rule Management
```http
GET    /api/categorization/rules
POST   /api/categorization/rules
GET    /api/categorization/rules/:id
PUT    /api/categorization/rules/:id
DELETE /api/categorization/rules/:id
```

**Request Example:**
```json
{
  "rule_type": "keyword",
  "pattern": "grocery",
  "category": "Food",
  "confidence_boost": 1.0
}
```

### Auto-categorization
```http
POST /api/transactions/:id/categorize
POST /api/transactions/bulk-categorize
GET  /api/categorization/suggestions/:transaction_id
```

### Training Data
```http
POST /api/categorization/feedback
GET  /api/categorization/training-stats
```

## Real-Time Collaboration

### Shared Resources
```http
GET    /api/collaboration/shared
POST   /api/collaboration/shared
GET    /api/collaboration/shared/:id
PUT    /api/collaboration/shared/:id
DELETE /api/collaboration/shared/:id
POST   /api/collaboration/shared/:id/invite
DELETE /api/collaboration/shared/:id/remove-user
```

**Request Example:**
```json
{
  "name": "Family Budget 2024",
  "description": "Shared budget for family expenses",
  "type": "budget",
  "is_public": false
}
```

### Permissions
```http
GET  /api/collaboration/:shared_id/permissions
PUT  /api/collaboration/:shared_id/permissions/:user_id
```

### Activity & Sessions
```http
GET  /api/collaboration/:shared_id/activity
GET  /api/collaboration/:shared_id/sessions
POST /api/collaboration/:shared_id/sessions/heartbeat
DELETE /api/collaboration/:shared_id/sessions/:session_id
```

## Financial Goal Tracking

### Goals Management
```http
GET    /api/goals
POST   /api/goals
GET    /api/goals/:id
PUT    /api/goals/:id
DELETE /api/goals/:id
```

**Request Example:**
```json
{
  "title": "Emergency Fund",
  "description": "Build 6-month emergency fund",
  "goal_type": "savings",
  "target_amount": 10000,
  "current_amount": 2500,
  "target_date": "2024-12-31",
  "priority": 3
}
```

### Milestones
```http
GET    /api/goals/:goal_id/milestones
POST   /api/goals/:goal_id/milestones
PUT    /api/goals/:goal_id/milestones/:milestone_id
DELETE /api/goals/:goal_id/milestones/:milestone_id
```

### Contributions
```http
GET    /api/goals/:goal_id/contributions
POST   /api/goals/:goal_id/contributions
PUT    /api/goals/:goal_id/contributions/:contribution_id
DELETE /api/goals/:goal_id/contributions/:contribution_id
```

### Analytics
```http
GET /api/goals/:goal_id/analytics
GET /api/goals/analytics/summary
GET /api/goals/:goal_id/projection
```

## Data Import/Export & Bank Integration

### Import Jobs
```http
GET    /api/data/import/jobs
POST   /api/data/import/upload
POST   /api/data/import/process/:job_id
GET    /api/data/import/jobs/:job_id
DELETE /api/data/import/jobs/:job_id
```

**Request Example:**
```json
{
  "file_format": "csv",
  "source": "file_upload",
  "mapping_id": "uuid",
  "options": {
    "skip_duplicates": true,
    "date_format": "MM/DD/YYYY"
  }
}
```

### Export Jobs
```http
GET    /api/data/export/jobs
POST   /api/data/export
GET    /api/data/export/jobs/:job_id
GET    /api/data/export/jobs/:job_id/download
```

### Bank Connections
```http
GET    /api/banks/connections
POST   /api/banks/connect
GET    /api/banks/connections/:id
DELETE /api/banks/connections/:id
POST   /api/banks/connections/:id/sync
```

### Import Mappings
```http
GET    /api/data/mappings
POST   /api/data/mappings
GET    /api/data/mappings/:id
PUT    /api/data/mappings/:id
DELETE /api/data/mappings/:id
```

## Advanced Reporting & Visualization

### Custom Reports
```http
GET    /api/reports/custom
POST   /api/reports/custom
GET    /api/reports/custom/:id
PUT    /api/reports/custom/:id
DELETE /api/reports/custom/:id
POST   /api/reports/custom/:id/generate
```

**Request Example:**
```json
{
  "name": "Monthly Spending Analysis",
  "report_type": "spending_analysis",
  "configuration": {
    "date_range": {
      "start": "2024-01-01",
      "end": "2024-12-31"
    },
    "filters": {
      "categories": ["Food", "Transport"],
      "min_amount": 0
    },
    "group_by": "category"
  },
  "visualization_config": {
    "chart_type": "pie",
    "colors": ["#FF6384", "#36A2EB"]
  }
}
```

### Report Sharing
```http
POST /api/reports/custom/:id/share
GET  /api/reports/shared/:token
PUT  /api/reports/shared/:token
DELETE /api/reports/shared/:token
```

### Analytics
```http
GET /api/analytics/spending-trends
GET /api/analytics/category-breakdown
GET /api/analytics/budget-performance
GET /api/analytics/comparative-analysis
```

## Custom Alerts & Notifications

### Notification Preferences
```http
GET    /api/notifications/preferences
PUT    /api/notifications/preferences
GET    /api/notifications/preferences/:alert_type
```

**Request Example:**
```json
{
  "alert_type": "budget_exceeded",
  "is_enabled": true,
  "notification_channels": {
    "email": true,
    "push": false,
    "sms": true
  },
  "threshold_value": 90,
  "frequency": "immediate"
}
```

### Notifications
```http
GET /api/notifications
PUT /api/notifications/:id/read
PUT /api/notifications/:id/dismiss
DELETE /api/notifications/:id
```

### Smart Alerts
```http
GET    /api/alerts/smart
POST   /api/alerts/smart
GET    /api/alerts/smart/:id
PUT    /api/alerts/smart/:id
DELETE /api/alerts/smart/:id
POST   /api/alerts/smart/:id/test
```

## Privacy & Security Dashboard

### Security Audit
```http
GET /api/security/audit-log
GET /api/security/audit-log/:id
GET /api/security/risk-assessment
POST /api/security/report-incident
```

### Privacy Settings
```http
GET /api/privacy/settings
PUT /api/privacy/settings
POST /api/privacy/data-export
POST /api/privacy/account-deletion
GET  /api/privacy/data-export/:request_id
```

### Two-Factor Authentication
```http
POST /api/security/2fa/setup
POST /api/security/2fa/verify
POST /api/security/2fa/disable
POST /api/security/2fa/backup-codes
```

### Data Retention
```http
GET    /api/privacy/retention-policies
POST   /api/privacy/retention-policies
PUT    /api/privacy/retention-policies/:id
DELETE /api/privacy/retention-policies/:id
```

## Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "target_amount",
      "reason": "Must be a positive number"
    }
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

## Rate Limiting

### Limits by Endpoint Category
- **Standard CRUD**: 100 requests/hour
- **Data Import/Export**: 10 requests/hour  
- **AI Analysis**: 50 requests/hour
- **Bank Sync**: 20 requests/hour

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Caching Strategy

### Cache Headers
```
Cache-Control: public, max-age=300
ETag: "abc123"
```

### Cacheable Endpoints
- GET /api/ai/insights (5 minutes)
- GET /api/analytics/* (1 hour)
- GET /api/reports/custom (30 minutes)

## Webhook Support

### Webhook Endpoints
```http
POST /api/webhooks/bank-transaction
POST /api/webhooks/goal-milestone
POST /api/webhooks/budget-alert
```

### Webhook Payload Example
```json
{
  "event": "transaction.synced",
  "timestamp": "2024-12-20T19:00:00Z",
  "data": {
    "transaction_id": "uuid",
    "amount": 50.00,
    "category": "Food"
  }
}
```

## Testing & Documentation

### API Documentation
- Swagger/OpenAPI specs available at `/api/docs`
- Postman collection provided
- Interactive API explorer at `/api/explorer`

### Testing Endpoints
```bash
# Health check
curl -X GET /api/health

# Authentication test
curl -X GET /api/auth/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Implementation Notes

1. **Supabase Integration**: All endpoints use Supabase Edge Functions
2. **Real-time Updates**: WebSocket connections for live collaboration
3. **File Uploads**: Direct Supabase Storage integration
4. **Background Jobs**: Supabase cron for scheduled tasks
5. **Monitoring**: Built-in request logging and analytics