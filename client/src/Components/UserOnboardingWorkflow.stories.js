import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Business as BusinessIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  AccountCircle as AccountIcon,
  DirectionsCar as VehicleIcon,
  Assessment as AnalyticsIcon
} from '@mui/icons-material';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { mockAuthService } from '../mockServices';

// Create a mock AuthProvider that uses mockAuthService
const MockAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    const result = await mockAuthService.login(email, password);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    await mockAuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    return { success: true };
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register: async () => ({ success: false, message: 'Not implemented' }),
    refreshToken: async () => ({ success: false }),
    checkAuthStatus: async () => {}
  };

  return (
    <AuthProvider value={value}>
      {children}
    </AuthProvider>
  );
};

// Onboarding Step Components
const WelcomeStep = ({ onNext }) => {
  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom color="primary">
        Welcome to Transportation Analytics Platform
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Let's get you set up with your fleet management system. This will only take a few minutes.
      </Typography>
      <Button 
        variant="contained" 
        size="large" 
        endIcon={<ArrowIcon />}
        onClick={onNext}
      >
        Get Started
      </Button>
    </Paper>
  );
};

const AccountSetupStep = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: 'fleet_manager'
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Account Setup
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Tell us about yourself and your organization
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Company Name"
            value={formData.company}
            onChange={handleChange('company')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="Role"
            value={formData.role}
            onChange={handleChange('role')}
            variant="outlined"
            SelectProps={{ native: true }}
          >
            <option value="fleet_manager">Fleet Manager</option>
            <option value="driver">Driver</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Administrator</option>
          </TextField>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>Back</Button>
        <Button 
          variant="contained" 
          onClick={onNext}
          disabled={!formData.firstName || !formData.lastName || !formData.email}
        >
          Continue
        </Button>
      </Box>
    </Paper>
  );
};

const FleetSetupStep = ({ onNext, onBack }) => {
  const [fleetData, setFleetData] = useState({
    vehicleCount: '',
    routeCount: '',
    hasExistingData: false,
    dataFormat: 'csv'
  });

  const handleChange = (field) => (event) => {
    setFleetData({ ...fleetData, [field]: event.target.value });
  };

  const handleCheckboxChange = (field) => (event) => {
    setFleetData({ ...fleetData, [field]: event.target.checked });
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Fleet Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Help us understand your current fleet setup
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Number of Vehicles"
            type="number"
            value={fleetData.vehicleCount}
            onChange={handleChange('vehicleCount')}
            variant="outlined"
            helperText="Approximate count"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Number of Routes"
            type="number"
            value={fleetData.routeCount}
            onChange={handleChange('routeCount')}
            variant="outlined"
            helperText="Active routes"
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Checkbox
              checked={fleetData.hasExistingData}
              onChange={handleCheckboxChange('hasExistingData')}
            />
            <Typography variant="body2">
              I have existing fleet data to import
            </Typography>
          </Box>
        </Grid>
        {fleetData.hasExistingData && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Data Format"
              value={fleetData.dataFormat}
              onChange={handleChange('dataFormat')}
              variant="outlined"
              SelectProps={{ native: true }}
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="json">JSON</option>
              <option value="api">API Integration</option>
            </TextField>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>Back</Button>
        <Button 
          variant="contained" 
          onClick={onNext}
          disabled={!fleetData.vehicleCount || !fleetData.routeCount}
        >
          Continue
        </Button>
      </Box>
    </Paper>
  );
};

const PreferencesStep = ({ onNext, onBack }) => {
  const [preferences, setPreferences] = useState({
    notifications: true,
    reports: true,
    analytics: true,
    timezone: 'UTC',
    units: 'metric'
  });

  const handleCheckboxChange = (field) => (event) => {
    setPreferences({ ...preferences, [field]: event.target.checked });
  };

  const handleChange = (field) => (event) => {
    setPreferences({ ...preferences, [field]: event.target.value });
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure your notification and display preferences
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Checkbox
                  checked={preferences.notifications}
                  onChange={handleCheckboxChange('notifications')}
                />
              </ListItemIcon>
              <ListItemText 
                primary="Email notifications" 
                secondary="Receive alerts about fleet performance and maintenance"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Checkbox
                  checked={preferences.reports}
                  onChange={handleCheckboxChange('reports')}
                />
              </ListItemIcon>
              <ListItemText 
                primary="Weekly reports" 
                secondary="Get automated weekly performance summaries"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Checkbox
                  checked={preferences.analytics}
                  onChange={handleCheckboxChange('analytics')}
                />
              </ListItemIcon>
              <ListItemText 
                primary="Analytics insights" 
                secondary="Receive AI-powered insights and recommendations"
              />
            </ListItem>
          </List>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Timezone"
            value={preferences.timezone}
            onChange={handleChange('timezone')}
            variant="outlined"
            SelectProps={{ native: true }}
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="PST">Pacific Time</option>
            <option value="GMT">Greenwich Mean Time</option>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Units"
            value={preferences.units}
            onChange={handleChange('units')}
            variant="outlined"
            SelectProps={{ native: true }}
          >
            <option value="metric">Metric (km, L)</option>
            <option value="imperial">Imperial (miles, gallons)</option>
          </TextField>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>Back</Button>
        <Button 
          variant="contained" 
          onClick={onNext}
        >
          Continue
        </Button>
      </Box>
    </Paper>
  );
};

const CompletionStep = ({ onFinish }) => {
  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom color="success.main">
        Setup Complete!
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Your transportation analytics platform is ready to use. You can now start managing your fleet and analyzing performance data.
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <VehicleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Fleet Management</Typography>
              <Typography variant="body2" color="text.secondary">
                Add vehicles and routes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PersonIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Driver Management</Typography>
              <Typography variant="body2" color="text.secondary">
                Track driver performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AnalyticsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Analytics</Typography>
              <Typography variant="body2" color="text.secondary">
                View reports and insights
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button 
        variant="contained" 
        size="large" 
        onClick={onFinish}
        endIcon={<ArrowIcon />}
      >
        Go to Dashboard
      </Button>
    </Paper>
  );
};

// Main User Onboarding Workflow Component
const UserOnboardingWorkflowDemo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = [
    { label: 'Welcome', component: WelcomeStep },
    { label: 'Account Setup', component: AccountSetupStep },
    { label: 'Fleet Information', component: FleetSetupStep },
    { label: 'Preferences', component: PreferencesStep },
    { label: 'Complete', component: CompletionStep }
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleFinish = () => {
    setCompleted(false);
    setActiveStep(0);
  };

  if (completed) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Onboarding completed! User would be redirected to the main dashboard.
        </Alert>
        <Button variant="outlined" onClick={handleFinish}>
          Start Over
        </Button>
      </Box>
    );
  }

  const CurrentStepComponent = steps[activeStep].component;

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        User Onboarding Workflow
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Step-by-step process for new users to get started with the platform
      </Typography>

      <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 4 }}>
        {steps.map((step, index) => (
          <Step key={step.label} completed={index < activeStep}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <CurrentStepComponent 
        onNext={handleNext}
        onBack={handleBack}
        onFinish={handleFinish}
      />

      <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Workflow Progress:</strong> Step {activeStep + 1} of {steps.length} - {steps[activeStep].label}
        </Typography>
      </Box>
    </Box>
  );
};

export default {
  title: 'Workflows/UserOnboarding',
  component: UserOnboardingWorkflowDemo,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <MockAuthProvider>
          <Story />
        </MockAuthProvider>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  render: () => <UserOnboardingWorkflowDemo />,
};

export const StepByStep = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    
    const steps = [
      { label: 'Welcome', component: WelcomeStep },
      { label: 'Account Setup', component: AccountSetupStep },
      { label: 'Fleet Information', component: FleetSetupStep },
      { label: 'Preferences', component: PreferencesStep },
      { label: 'Complete', component: CompletionStep }
    ];

    const CurrentStepComponent = steps[currentStep].component;

    return (
      <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Individual Step: {steps[currentStep].label}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            sx={{ mr: 1 }}
          >
            Previous
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </Box>
        <CurrentStepComponent 
          onNext={() => setCurrentStep(currentStep + 1)}
          onBack={() => setCurrentStep(currentStep - 1)}
          onFinish={() => setCurrentStep(0)}
        />
      </Box>
    );
  },
};
