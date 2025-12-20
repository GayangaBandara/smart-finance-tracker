# Component Hierarchy for Advanced Features

## Overview

This document outlines the React component structure needed to implement all 8 advanced features. The hierarchy follows React best practices with proper separation of concerns, reusability, and maintainability.

## Component Organization Principles

### 1. Feature-Based Structure
```
src/components/
├── features/
│   ├── ai-insights/
│   ├── auto-categorization/
│   ├── collaboration/
│   ├── goals/
│   ├── data-import/
│   ├── advanced-reports/
│   ├── notifications/
│   └── security/
├── shared/
│   ├── forms/
│   ├── charts/
│   ├── modals/
│   └── layout/
└── common/
```

### 2. Component Types
- **Container Components**: Handle business logic and data fetching
- **Presentational Components**: Focus on UI and user interaction
- **Higher-Order Components (HOCs)**: Add common functionality
- **Custom Hooks**: Encapsulate stateful logic

## AI-Powered Financial Insights

### Component Hierarchy
```
features/ai-insights/
├── AIInsightsDashboard.tsx           # Main dashboard container
├── components/
│   ├── InsightCard.tsx               # Individual insight display
│   ├── InsightList.tsx               # List of insights
│   ├── InsightDetail.tsx             # Detailed insight view
│   ├── PatternVisualization.tsx      # Pattern charts
│   ├── FinancialHealthScore.tsx      # Health score widget
│   ├── AIRecommendations.tsx         # Actionable recommendations
│   └── InsightFilters.tsx            # Filter insights by type/priority
├── hooks/
│   ├── useAIInsights.ts              # AI insights data fetching
│   ├── useFinancialPatterns.ts       # Pattern detection logic
│   └── useHealthScore.ts             # Health score calculation
├── services/
│   └── aiService.ts                  # AI API interactions
└── types/
    └── ai.types.ts                   # AI-related TypeScript types
```

### Component Details

#### AIInsightsDashboard.tsx
- Main container for AI insights
- Fetches and displays insights
- Handles insight interactions (mark as read, dismiss)
- Integrates with real-time updates

#### InsightCard.tsx
```typescript
interface InsightCardProps {
  insight: AIInsight;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onViewDetails: (id: string) => void;
}
```

#### PatternVisualization.tsx
- Interactive charts showing spending patterns
- Uses Chart.js/Recharts for visualization
- Supports drill-down functionality
- Responsive design for mobile

## Automated Transaction Categorization

### Component Hierarchy
```
features/auto-categorization/
├── AutoCategorizationManager.tsx     # Main management interface
├── components/
│   ├── CategorySuggestions.tsx       # Show suggested categories
│   ├── ConfidenceIndicator.tsx       # Show confidence scores
│   ├── BulkEditModal.tsx             # Bulk categorization
│   ├── CategoryRulesManager.tsx      # Manage categorization rules
│   ├── RuleForm.tsx                  # Create/edit rules
│   └── TrainingFeedback.tsx          # User feedback interface
├── hooks/
│   ├── useAutoCategorization.ts      # Auto-categorization logic
│   ├── useCategoryRules.ts           # Rules management
│   └── useCategorizationFeedback.ts  # Training feedback
└── services/
    └── categorizationService.ts      # Categorization API
```

### Enhanced Existing Components

#### TransactionForm.tsx (Enhanced)
```typescript
interface EnhancedTransactionFormProps {
  transaction?: Transaction;
  onAutoCategorize: (description: string) => Promise<string>;
  showConfidenceIndicator: boolean;
  onCategoryChange: (category: string, confidence: number) => void;
}
```

#### TransactionList.tsx (Enhanced)
```typescript
interface EnhancedTransactionListProps {
  transactions: Transaction[];
  showCategorizationStatus: boolean;
  onBulkEdit: (transactionIds: string[]) => void;
  enableInlineEditing: boolean;
}
```

## Real-Time Collaboration

### Component Hierarchy
```
features/collaboration/
├── CollaborationDashboard.tsx        # Main collaboration interface
├── components/
│   ├── CollaborationPanel.tsx        # Side panel for collaboration
│   ├── InviteModal.tsx               # Invite users modal
│   ├── SharedBudgetView.tsx          # View shared budgets
│   ├── ActivityFeed.tsx              # Real-time activity feed
│   ├── ConflictResolution.tsx        # Handle edit conflicts
│   ├── PermissionManager.tsx         # Manage user permissions
│   ├── UserAvatars.tsx               # Show active users
│   └── PresenceIndicator.tsx         # Show who's online
├── hooks/
│   ├── useCollaboration.ts           # Collaboration state management
│   ├── useRealTimeSync.ts            # Real-time synchronization
│   ├── useCollaborationPermissions.ts # Permission logic
│   └── useActivityFeed.ts            # Activity feed updates
└── services/
    └── collaborationService.ts       # Collaboration API
```

### Integration Points

#### Enhanced BudgetOverview.tsx
```typescript
interface CollaborativeBudgetOverviewProps {
  budgetId: string;
  isShared: boolean;
  collaborationFeatures: boolean;
  onInviteCollaborators: () => void;
  onShareSettings: () => void;
}
```

## Financial Goal Tracking

### Component Hierarchy
```
features/goals/
├── GoalDashboard.tsx                 # Main goals overview
├── components/
│   ├── GoalCard.tsx                  # Individual goal display
│   ├── GoalProgress.tsx              # Progress visualization
│   ├── GoalPlanner.tsx               # Goal creation wizard
│   ├── MilestoneTracker.tsx          # Milestone management
│   ├── GoalAnalytics.tsx             # Performance analytics
│   ├── GoalContributions.tsx         # Contribution tracking
│   ├── AutomaticContributions.tsx    # Auto-contribution setup
│   ├── GoalComparison.tsx            # Compare multiple goals
│   └── GoalSharing.tsx               # Share goals with others
├── hooks/
│   ├── useGoals.ts                   # Goals data management
│   ├── useGoalProgress.ts            # Progress calculations
│   ├── useMilestones.ts              # Milestone management
│   └── useGoalAnalytics.ts           # Analytics and insights
└── services/
    └── goalService.ts                # Goals API
```

### Goal Components Details

#### GoalCard.tsx
```typescript
interface GoalCardProps {
  goal: FinancialGoal;
  showActions: boolean;
  onContribute: (goalId: string, amount: number) => void;
  onEdit: (goal: FinancialGoal) => void;
  onDelete: (goalId: string) => void;
  progress: number;
  daysRemaining: number;
  onTrack: boolean;
}
```

#### GoalProgress.tsx
```typescript
interface GoalProgressProps {
  goal: FinancialGoal;
  currentAmount: number;
  targetAmount: number;
  targetDate: Date;
  showProjection: boolean;
  onAdjustTarget: (newTarget: number) => void;
}
```

## Data Import/Export & Bank Integration

### Component Hierarchy
```
features/data-import/
├── DataManagementCenter.tsx          # Main data management hub
├── components/
│   ├── DataImportWizard.tsx          # Multi-step import process
│   ├── ImportMapping.tsx             # Column mapping interface
│   ├── BankConnections.tsx           # Bank connection management
│   ├── ImportProgress.tsx            # Import progress indicator
│   ├── DataValidation.tsx            # Validate imported data
│   ├── ExportCenter.tsx              # Data export interface
│   ├── SyncStatus.tsx                # Sync status and logs
│   ├── FileUploader.tsx              # Drag-and-drop file upload
│   └── FormatSelector.tsx            # Select import/export format
├── hooks/
│   ├── useDataImport.ts              # Import process management
│   ├── useBankConnections.ts         # Bank connection logic
│   ├── useDataExport.ts              # Export functionality
│   └── useSyncStatus.ts              # Sync status tracking
└── services/
    ├── importService.ts              # Import API
    ├── bankService.ts                # Bank integration API
    └── exportService.ts              # Export API
```

### File Processing Components

#### DataImportWizard.tsx
```typescript
interface DataImportWizardProps {
  onComplete: (results: ImportResults) => void;
  onCancel: () => void;
}

interface ImportSteps {
  1: FileUpload;
  2: FormatDetection;
  3: ColumnMapping;
  4: DataValidation;
  5: ImportConfirmation;
  6: ImportProgress;
  7: ResultsSummary;
}
```

## Advanced Reporting & Visualization

### Component Hierarchy
```
features/advanced-reports/
├── ReportBuilder.tsx                 # Custom report builder
├── components/
│   ├── ReportCard.tsx                # Report display card
│   ├── DashboardBuilder.tsx          # Custom dashboard creator
│   ├── AdvancedCharts.tsx            # Enhanced chart components
│   ├── ReportScheduler.tsx           # Schedule recurring reports
│   ├── ComparativeAnalysis.tsx       # Compare periods/users
│   ├── PredictiveAnalytics.tsx       # Show predictions
│   ├── ReportSharing.tsx             # Share reports
│   ├── CustomVisualization.tsx       # Drag-and-drop charts
│   ├── ReportTemplates.tsx           # Pre-built report templates
│   └── ExportOptions.tsx             # Multiple export formats
├── hooks/
│   ├── useReportBuilder.ts           # Report building logic
│   ├── useAdvancedAnalytics.ts       # Analytics calculations
│   ├── useReportSharing.ts           # Sharing functionality
│   └── useCustomCharts.ts            # Chart configuration
└── services/
    ├── reportService.ts              # Report API
    └── analyticsService.ts           # Analytics API
```

### Chart Components

#### AdvancedCharts.tsx
```typescript
interface AdvancedChartProps {
  data: any[];
  chartType: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap';
  configuration: ChartConfiguration;
  interactive: boolean;
  responsive: boolean;
  onDataPointClick?: (data: any) => void;
  onExport?: (format: string) => void;
}
```

## Custom Alerts & Notifications

### Component Hierarchy
```
features/notifications/
├── NotificationCenter.tsx            # Main notifications interface
├── components/
│   ├── AlertPreferences.tsx          # Notification settings
│   ├── SmartAlerts.tsx               # Smart rule builder
│   ├── NotificationHistory.tsx       # Past notifications
│   ├── AlertBuilder.tsx              # Custom alert creator
│   ├── NotificationItem.tsx          # Individual notification
│   ├── PriorityBadge.tsx             # Priority indicator
│   ├── ChannelSelector.tsx           # Select notification channels
│   └── QuietHoursSettings.tsx        # Quiet hours configuration
├── hooks/
│   ├── useNotifications.ts           # Notifications management
│   ├── useAlertPreferences.ts        # Preferences logic
│   ├── useSmartAlerts.ts             # Smart alert rules
│   └── useNotificationChannels.ts    # Channel management
└── services/
    └── notificationService.ts        # Notifications API
```

### Notification Components

#### NotificationItem.tsx
```typescript
interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onAction?: (action: string, data: any) => void;
  showTimestamp: boolean;
  compact: boolean;
}
```

## Privacy & Security Dashboard

### Component Hierarchy
```
features/security/
├── SecurityDashboard.tsx             # Main security overview
├── components/
│   ├── PrivacySettings.tsx           # Privacy preferences
│   ├── AuditLogViewer.tsx            # Security audit logs
│   ├── TwoFactorSetup.tsx            # 2FA setup wizard
│   ├── DataExport.tsx                # Data export requests
│   ├── AccountDeletion.tsx           # Account deletion flow
│   ├── SecurityScore.tsx             # Overall security score
│   ├── RiskAssessment.tsx            # Security risk analysis
│   ├── SessionManager.tsx            # Active sessions
│   ├── DataRetentionSettings.tsx     # Retention policy management
│   └── ComplianceReport.tsx          # Compliance documentation
├── hooks/
│   ├── useSecuritySettings.ts        # Security preferences
│   ├── useAuditLogs.ts               # Audit log management
│   ├── useTwoFactorAuth.ts           # 2FA functionality
│   └── usePrivacyControls.ts         # Privacy settings
└── services/
    └── securityService.ts            # Security API
```

### Security Components

#### SecurityDashboard.tsx
```typescript
interface SecurityDashboardProps {
  userId: string;
  showAllSections: boolean;
  onSecurityScoreUpdate: (score: number) => void;
}

interface SecurityMetrics {
  twoFactorEnabled: boolean;
  passwordStrength: number;
  recentLogins: LoginActivity[];
  dataEncryptionStatus: string;
  privacyScore: number;
}
```

## Shared Components

### Form Components
```
shared/forms/
├── FormField.tsx                     # Reusable form field
├── FormValidation.tsx                # Form validation display
├── DynamicForm.tsx                   # Dynamic form generator
├── FormWizard.tsx                    # Multi-step form
└── FieldArray.tsx                    # Array field management
```

### Chart Components
```
shared/charts/
├── BaseChart.tsx                     # Base chart wrapper
├── InteractiveChart.tsx              # Interactive chart wrapper
├── ChartExport.tsx                   # Chart export functionality
├── ChartFilters.tsx                  # Chart filtering controls
└── ChartLegend.tsx                   # Custom chart legend
```

### Modal Components
```
shared/modals/
├── BaseModal.tsx                     # Reusable modal base
├── ConfirmationModal.tsx             # Confirmation dialog
├── FormModal.tsx                     # Modal with form
├── ImageModal.tsx                    # Image viewer modal
└── FullScreenModal.tsx               # Full-screen modal
```

## Layout Components

### Enhanced Navigation
```
shared/layout/
├── EnhancedSidebar.tsx               # Sidebar with new features
├── FeatureNavigation.tsx             # Feature-specific navigation
├── Breadcrumbs.tsx                   # Navigation breadcrumbs
├── PageHeader.tsx                    # Page header with actions
└── LoadingStates.tsx                 # Loading indicators
```

## Context Providers

### New Context Providers
```typescript
// AI Insights Context
interface AIInsightsContextType {
  insights: AIInsight[];
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => void;
  dismissInsight: (id: string) => void;
}

// Collaboration Context
interface CollaborationContextType {
  activeUsers: User[];
  sharedResources: SharedResource[];
  isConnected: boolean;
  joinSession: (resourceId: string) => void;
  leaveSession: (resourceId: string) => void;
}

// Notifications Context
interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  markAsRead: (id: string) => void;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
}
```

## Performance Optimizations

### Component Optimizations
1. **React.memo**: Prevent unnecessary re-renders
2. **useMemo/useCallback**: Cache expensive calculations
3. **Lazy Loading**: Code split heavy components
4. **Virtual Scrolling**: Handle large data sets
5. **Suspense**: Handle loading states gracefully

### Example Optimized Component
```typescript
const InsightCard = React.memo<InsightCardProps>(({ insight, onMarkAsRead, onDismiss }) => {
  const handleMarkAsRead = useCallback(() => {
    onMarkAsRead(insight.id);
  }, [insight.id, onMarkAsRead]);

  return (
    <div className="insight-card">
      {/* Component content */}
    </div>
  );
});
```

## Accessibility Features

### ARIA Support
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Example Accessible Component
```typescript
const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => (
  <div
    role="alert"
    aria-live="polite"
    aria-label={`${notification.type}: ${notification.title}`}
    tabIndex={0}
  >
    {/* Content */}
  </div>
);
```

## Testing Strategy

### Component Testing Structure
```
tests/
├── components/
│   ├── ai-insights/
│   │   ├── AIInsightsDashboard.test.tsx
│   │   └── InsightCard.test.tsx
│   ├── collaboration/
│   │   ├── CollaborationPanel.test.tsx
│   │   └── ActivityFeed.test.tsx
│   └── [other features]/
├── hooks/
│   ├── useAIInsights.test.ts
│   └── useCollaboration.test.ts
└── integration/
    ├── ai-workflow.test.tsx
    └── collaboration-workflow.test.tsx
```

### Testing Examples
```typescript
describe('InsightCard', () => {
  it('should call onMarkAsRead when mark as read button is clicked', () => {
    const mockOnMarkAsRead = jest.fn();
    render(
      <InsightCard 
        insight={mockInsight} 
        onMarkAsRead={mockOnMarkAsRead}
        onDismiss={jest.fn()}
        onViewDetails={jest.fn()}
      />
    );
    
    fireEvent.click(screen.getByText('Mark as Read'));
    expect(mockOnMarkAsRead).toHaveBeenCalledWith(mockInsight.id);
  });
});
```

## Implementation Guidelines

### 1. Component Naming Convention
- Use PascalCase for components
- Use camelCase for props and functions
- Use descriptive names that indicate purpose
- Prefix with feature name when ambiguous

### 2. File Organization
- One component per file
- Group related components in folders
- Use index files for clean imports
- Separate business logic into custom hooks

### 3. State Management
- Use Context API for global state
- Use useState for local component state
- Use useReducer for complex state logic
- Minimize prop drilling with context

### 4. Styling Approach
- Use Tailwind CSS classes
- Create custom components for repeated patterns
- Use CSS variables for theming
- Ensure responsive design

### 5. Error Handling
- Implement error boundaries
- Provide fallback UI for errors
- Log errors for debugging
- Show user-friendly error messages

This component hierarchy provides a solid foundation for implementing all 8 advanced features while maintaining code quality, reusability, and scalability.