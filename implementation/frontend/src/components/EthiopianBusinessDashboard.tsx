import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tab,
  Tabs,
  Badge,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  AccountBalance as BankIcon,
  Receipt as TaxIcon,
  Business as LicenseIcon,
  Language as CultureIcon,
  Notifications as NotificationIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

import { ethiopianCalendarService } from '../services/ethiopianCalendarService';
import { ethiopianLanguageService } from '../services/ethiopianLanguageService';
import { ethiopianCulturalIntegrationService } from '../services/ethiopianCulturalIntegrationService';

interface EthiopianBusinessDashboardProps {
  businessInfo?: {
    name: string;
    tin: string;
    businessType: string;
    sector: string;
  };
}

interface ComplianceStatus {
  area: string;
  status: 'compliant' | 'warning' | 'critical' | 'unknown';
  score: number;
  issues: string[];
  recommendations: string[];
  lastChecked: Date;
}

interface UpcomingDeadline {
  id: string;
  title: string;
  date: Date;
  type: 'tax' | 'license' | 'banking' | 'regulatory';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

const EthiopianBusinessDashboard: React.FC<EthiopianBusinessDashboardProps> = ({ businessInfo }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState(0);
  const [complianceData, setComplianceData] = useState<ComplianceStatus[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([]);
  const [culturalEvents, setCulturalEvents] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [overallComplianceScore, setOverallComplianceScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDeadline, setSelectedDeadline] = useState<UpcomingDeadline | null>(null);

  useEffect(() => {
    initializeDashboard();
  }, [businessInfo]);

  const initializeDashboard = async () => {
    setLoading(true);
    try {
      // Load Ethiopian calendar data
      const today = new Date();
      
      // Get cultural events for the next 30 days
      const events = [];
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        const event = ethiopianCulturalIntegrationService.getCulturalEventForDate(checkDate);
        if (event) {
          events.push(event);
        }
      }
      setCulturalEvents(events);

      // Simulate compliance data
      const compliance: ComplianceStatus[] = [
        {
          area: 'Tax Compliance',
          status: 'warning',
          score: 75,
          issues: ['VAT return due in 5 days', 'Withholding tax calculation discrepancy'],
          recommendations: ['File VAT return early', 'Review withholding calculations'],
          lastChecked: new Date()
        },
        {
          area: 'Banking Compliance',
          status: 'compliant',
          score: 92,
          issues: [],
          recommendations: ['Maintain current reporting standards'],
          lastChecked: new Date()
        },
        {
          area: 'Business Licenses',
          status: 'critical',
          score: 45,
          issues: ['Trade license expires in 15 days', 'Environmental permit overdue'],
          recommendations: ['Renew trade license immediately', 'Apply for environmental permit'],
          lastChecked: new Date()
        },
        {
          area: 'Cultural Integration',
          status: 'warning',
          score: 68,
          issues: ['Upcoming fasting period not in schedule', 'Cultural training incomplete'],
          recommendations: ['Update schedules for religious observances', 'Complete cultural training'],
          lastChecked: new Date()
        }
      ];
      setComplianceData(compliance);

      // Calculate overall compliance score
      const avgScore = compliance.reduce((sum, item) => sum + item.score, 0) / compliance.length;
      setOverallComplianceScore(Math.round(avgScore));

      // Generate upcoming deadlines
      const deadlines: UpcomingDeadline[] = [
        {
          id: '1',
          title: 'VAT Return Filing',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          type: 'tax',
          urgency: 'high',
          description: 'Monthly VAT return must be filed to ERCA'
        },
        {
          id: '2',
          title: 'Trade License Renewal',
          date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          type: 'license',
          urgency: 'critical',
          description: 'Business trading license expires and must be renewed'
        },
        {
          id: '3',
          title: 'Bank Prudential Return',
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          type: 'banking',
          urgency: 'medium',
          description: 'Monthly banking compliance report to NBE'
        },
        {
          id: '4',
          title: 'Quarterly Labor Report',
          date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          type: 'regulatory',
          urgency: 'low',
          description: 'Employment statistics report to Ministry of Labor'
        }
      ];
      setUpcomingDeadlines(deadlines);

      // Generate notifications
      const notifs = [
        {
          id: '1',
          type: 'warning',
          title: 'Upcoming Holiday Impact',
          message: 'Meskel celebration in 3 days will affect business operations',
          date: new Date(),
          read: false
        },
        {
          id: '2',
          type: 'info',
          title: 'Cultural Training Available',
          message: 'New Ethiopian business etiquette training module available',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          read: false
        },
        {
          id: '3',
          type: 'success',
          title: 'Compliance Check Passed',
          message: 'Banking compliance review completed successfully',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          read: true
        }
      ];
      setNotifications(notifs);

    } catch (error) {
      console.error('Error initializing dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircleIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'critical': return <ErrorIcon color="error" />;
      default: return <InfoIcon color="info" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const formatEthiopianDate = (date: Date) => {
    try {
      const ethDate = ethiopianCalendarService.convertToEthiopian(date);
      return `${ethDate.ethiopianDay}/${ethDate.ethiopianMonth}/${ethDate.ethiopianYear}`;
    } catch {
      return 'Invalid date';
    }
  };

  const translate = (key: string) => {
    try {
      return ethiopianLanguageService.translate(key);
    } catch {
      return key;
    }
  };

  const handleDeadlineClick = (deadline: UpcomingDeadline) => {
    setSelectedDeadline(deadline);
  };

  const handleCloseDeadlineDialog = () => {
    setSelectedDeadline(null);
  };

  const renderComplianceOverview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" color="textSecondary">
                {translate('overall_compliance')}
              </Typography>
              <TrendingUpIcon color="primary" />
            </Box>
            <Typography variant="h3" color="primary">
              {overallComplianceScore}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={overallComplianceScore} 
              color={overallComplianceScore >= 80 ? 'success' : overallComplianceScore >= 60 ? 'warning' : 'error'}
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>
      </Grid>

      {complianceData.map((item, index) => (
        <Grid item xs={12} md={6} lg={3} key={index}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1">
                  {translate(item.area.toLowerCase().replace(' ', '_'))}
                </Typography>
                {getStatusIcon(item.status)}
              </Box>
              <Typography variant="h4" color="textPrimary">
                {item.score}%
              </Typography>
              <Chip 
                label={translate(item.status)} 
                color={getStatusColor(item.status) as any}
                size="small"
                sx={{ mt: 1 }}
              />
              {item.issues.length > 0 && (
                <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                  {item.issues.length} {translate('issues_found')}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderUpcomingDeadlines = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {translate('upcoming_deadlines')}
        </Typography>
        <List>
          {upcomingDeadlines.map((deadline, index) => (
            <React.Fragment key={deadline.id}>
              <ListItem 
                button 
                onClick={() => handleDeadlineClick(deadline)}
                sx={{ pl: 0 }}
              >
                <ListItemIcon>
                  <Badge 
                    variant="dot" 
                    color={getUrgencyColor(deadline.urgency) as any}
                  >
                    <ScheduleIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2">
                        {deadline.title}
                      </Typography>
                      <Chip 
                        label={deadline.urgency} 
                        size="small" 
                        color={getUrgencyColor(deadline.urgency) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Due: {deadline.date.toLocaleDateString()} ({formatEthiopianDate(deadline.date)})
                      </Typography>
                      <br />
                      <Typography variant="caption">
                        {deadline.description}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < upcomingDeadlines.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderCulturalEvents = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {translate('cultural_events')}
        </Typography>
        {culturalEvents.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            {translate('no_upcoming_events')}
          </Typography>
        ) : (
          <List>
            {culturalEvents.map((event, index) => (
              <React.Fragment key={event.id}>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle2">
                          {currentLanguage === 'am' ? event.nameAmharic : event.name}
                        </Typography>
                        <Chip 
                          label={event.significance} 
                          size="small" 
                          color={event.significance === 'high' ? 'error' : 'info'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          {event.date.toLocaleDateString()} ({event.ethiopianDate})
                        </Typography>
                        <br />
                        <Typography variant="caption">
                          Duration: {event.duration} days | Impact: {event.businessImpact.businessHours}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < culturalEvents.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const renderNotifications = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {translate('notifications')}
        </Typography>
        <List>
          {notifications.slice(0, 5).map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem sx={{ pl: 0 }}>
                <ListItemIcon>
                  <NotificationIcon 
                    color={notification.read ? 'disabled' : 'primary'} 
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography 
                      variant="subtitle2" 
                      fontWeight={notification.read ? 'normal' : 'bold'}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {notification.date.toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < Math.min(notifications.length, 5) - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderQuickActions = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {translate('quick_actions')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<TaxIcon />}
              size="small"
            >
              {translate('file_vat_return')}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LicenseIcon />}
              size="small"
            >
              {translate('renew_license')}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<BankIcon />}
              size="small"
            >
              {translate('banking_report')}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AssessmentIcon />}
              size="small"
            >
              {translate('compliance_check')}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<CultureIcon />}
              color="primary"
            >
              {translate('cultural_training')}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {translate('ethiopian_business_dashboard')}
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'am' : 'en')}
            startIcon={<CultureIcon />}
          >
            {currentLanguage === 'en' ? 'አማርኛ' : 'English'}
          </Button>
          <Button variant="contained" color="primary">
            {translate('refresh_data')}
          </Button>
        </Box>
      </Box>

      {/* Business Info Alert */}
      {businessInfo && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">
            {translate('business')}: {businessInfo.name} | {translate('tin')}: {businessInfo.tin} | 
            {translate('type')}: {businessInfo.businessType}
          </Typography>
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label={translate('overview')} />
          <Tab label={translate('compliance')} />
          <Tab label={translate('deadlines')} />
          <Tab label={translate('cultural_calendar')} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {renderComplianceOverview()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderUpcomingDeadlines()}
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {renderQuickActions()}
              </Grid>
              <Grid item xs={12}>
                {renderNotifications()}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {complianceData.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
                    <Typography variant="h6">
                      {translate(item.area.toLowerCase().replace(' ', '_'))}
                    </Typography>
                    {getStatusIcon(item.status)}
                  </Box>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {item.score}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.score} 
                    color={getStatusColor(item.status) as any}
                    sx={{ mb: 2 }}
                  />
                  {item.issues.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" color="error" gutterBottom>
                        {translate('issues')}:
                      </Typography>
                      <List dense>
                        {item.issues.map((issue, i) => (
                          <ListItem key={i} sx={{ pl: 0 }}>
                            <ListItemIcon>
                              <ErrorIcon color="error" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={issue} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                  {item.recommendations.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="info.main" gutterBottom>
                        {translate('recommendations')}:
                      </Typography>
                      <List dense>
                        {item.recommendations.map((rec, i) => (
                          <ListItem key={i} sx={{ pl: 0 }}>
                            <ListItemIcon>
                              <InfoIcon color="info" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={rec} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                  <Typography variant="caption" color="textSecondary">
                    {translate('last_checked')}: {item.lastChecked.toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && renderUpcomingDeadlines()}

      {activeTab === 3 && renderCulturalEvents()}

      {/* Deadline Details Dialog */}
      <Dialog 
        open={!!selectedDeadline} 
        onClose={handleCloseDeadlineDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedDeadline && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={1}>
                {selectedDeadline.title}
                <Chip 
                  label={selectedDeadline.urgency} 
                  color={getUrgencyColor(selectedDeadline.urgency) as any}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                {selectedDeadline.description}
              </Typography>
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  {translate('due_date')}:
                </Typography>
                <Typography variant="body2">
                  {selectedDeadline.date.toLocaleDateString()} ({formatEthiopianDate(selectedDeadline.date)})
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  {translate('type')}:
                </Typography>
                <Typography variant="body2">
                  {translate(selectedDeadline.type)}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeadlineDialog}>
                {translate('close')}
              </Button>
              <Button variant="contained" color="primary">
                {translate('take_action')}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default EthiopianBusinessDashboard;
