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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormControlLabel,
  Switch,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Assessment as AnalyticsIcon, 
  TrendingUp as TrendingUpIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  PlayArrow as RunIcon,
  Stop as StopIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableIcon,
  GetApp as ExportIcon
} from '@mui/icons-material';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { mockAuthService } from '../mockServices';

// Create a mock AuthProvider that uses mockAuthService
const MockAuthProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Data Analyst', email: 'analyst@fleet.com' });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

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

// Mock data for analysis
const mockAnalysisTypes = [
  { id: 'fuel', name: 'Fuel Efficiency Analysis', description: 'Analyze fuel consumption patterns', icon: <TrendingUpIcon /> },
  { id: 'performance', name: 'Performance Metrics', description: 'Vehicle and driver performance analysis', icon: <BarChartIcon /> },
  { id: 'routes', name: 'Route Optimization', description: 'Analyze route efficiency and timing', icon: <LineChartIcon /> },
  { id: 'maintenance', name: 'Maintenance Predictions', description: 'Predict maintenance needs', icon: <PieChartIcon /> }
];

const mockDataSources = [
  { id: 'vehicles', name: 'Vehicle Data', records: 1250, lastUpdated: '2 hours ago', status: 'active' },
  { id: 'drivers', name: 'Driver Data', records: 45, lastUpdated: '1 hour ago', status: 'active' },
  { id: 'routes', name: 'Route Data', records: 89, lastUpdated: '30 minutes ago', status: 'active' },
  { id: 'fuel', name: 'Fuel Data', records: 3400, lastUpdated: '15 minutes ago', status: 'active' },
  { id: 'maintenance', name: 'Maintenance Data', records: 156, lastUpdated: '1 day ago', status: 'warning' }
];

const mockAnalysisResults = [
  { id: 'R001', name: 'Fuel Efficiency Report', type: 'fuel', status: 'completed', created: '2024-01-15', insights: 5 },
  { id: 'R002', name: 'Performance Analysis', type: 'performance', status: 'running', created: '2024-01-15', insights: 0 },
  { id: 'R003', name: 'Route Optimization', type: 'routes', status: 'completed', created: '2024-01-14', insights: 3 },
  { id: 'R004', name: 'Maintenance Forecast', type: 'maintenance', status: 'failed', created: '2024-01-14', insights: 0 }
];

// Analysis Type Selection Component
const AnalysisTypeSelection = ({ onSelectType, selectedType }) => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Select Analysis Type
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose the type of analysis you want to perform
      </Typography>

      <Grid container spacing={2}>
        {mockAnalysisTypes.map((type) => (
          <Grid item xs={12} sm={6} md={3} key={type.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: selectedType === type.id ? 2 : 1,
                borderColor: selectedType === type.id ? 'primary.main' : 'grey.300',
                '&:hover': { borderColor: 'primary.main' }
              }}
              onClick={() => onSelectType(type.id)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {type.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {type.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {type.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

// Data Source Configuration Component
const DataSourceConfiguration = ({ selectedType, onConfigure, onBack }) => {
  const [selectedSources, setSelectedSources] = useState([]);
  const [dateRange, setDateRange] = useState([30, 90]);
  const [filters, setFilters] = useState({
    vehicleTypes: [],
    drivers: [],
    routes: []
  });

  const handleSourceToggle = (sourceId) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleConfigure = () => {
    onConfigure({
      type: selectedType,
      sources: selectedSources,
      dateRange,
      filters
    });
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Configure Data Sources
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select data sources and configure parameters for your analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Available Data Sources
          </Typography>
          <List>
            {mockDataSources.map((source) => (
              <ListItem key={source.id}>
                <ListItemIcon>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedSources.includes(source.id)}
                        onChange={() => handleSourceToggle(source.id)}
                      />
                    }
                    label=""
                  />
                </ListItemIcon>
                <ListItemText
                  primary={source.name}
                  secondary={`${source.records} records • Updated ${source.lastUpdated}`}
                />
                <Chip 
                  label={source.status} 
                  color={source.status === 'active' ? 'success' : 'warning'}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Analysis Parameters
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              Date Range: {dateRange[0]} - {dateRange[1]} days
            </Typography>
            <Slider
              value={dateRange}
              onChange={(e, newValue) => setDateRange(newValue)}
              valueLabelDisplay="auto"
              min={1}
              max={365}
              step={1}
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Vehicle Types</InputLabel>
            <Select
              multiple
              value={filters.vehicleTypes}
              onChange={(e) => setFilters({...filters, vehicleTypes: e.target.value})}
              label="Vehicle Types"
            >
              <MenuItem value="truck">Trucks</MenuItem>
              <MenuItem value="van">Vans</MenuItem>
              <MenuItem value="car">Cars</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Drivers</InputLabel>
            <Select
              multiple
              value={filters.drivers}
              onChange={(e) => setFilters({...filters, drivers: e.target.value})}
              label="Drivers"
            >
              <MenuItem value="all">All Drivers</MenuItem>
              <MenuItem value="senior">Senior Drivers</MenuItem>
              <MenuItem value="new">New Drivers</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>Back</Button>
        <Button 
          variant="contained" 
          onClick={handleConfigure}
          disabled={selectedSources.length === 0}
        >
          Configure Analysis
        </Button>
      </Box>
    </Paper>
  );
};

// Analysis Execution Component
const AnalysisExecution = ({ analysisConfig, onRun, onBack, isRunning }) => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Run Analysis
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review your configuration and start the analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Configuration Summary
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Analysis Type"
                secondary={mockAnalysisTypes.find(t => t.id === analysisConfig.type)?.name}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Data Sources"
                secondary={`${analysisConfig.sources.length} sources selected`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Date Range"
                secondary={`${analysisConfig.dateRange[0]} - ${analysisConfig.dateRange[1]} days`}
              />
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Expected Outputs
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
              <ListItemText primary="Performance Charts" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
              <ListItemText primary="Statistical Summary" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
              <ListItemText primary="Insights & Recommendations" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
              <ListItemText primary="Exportable Reports" />
            </ListItem>
          </List>
        </Grid>
      </Grid>

      {isRunning && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Analysis is running... This may take a few minutes depending on data size.
        </Alert>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack} disabled={isRunning}>Back</Button>
        <Button 
          variant="contained" 
          onClick={onRun}
          disabled={isRunning}
          startIcon={isRunning ? <StopIcon /> : <RunIcon />}
        >
          {isRunning ? 'Running...' : 'Run Analysis'}
        </Button>
      </Box>
    </Paper>
  );
};

// Results and Insights Component
const ResultsAndInsights = ({ results, onExport, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Analysis Results
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review your analysis results and insights
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Summary" />
        <Tab label="Charts" />
        <Tab label="Insights" />
        <Tab label="Export" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUpIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">87.3%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Efficiency
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <BarChartIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">12</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Key Insights
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <WarningIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">3</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Areas for Improvement
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">95%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Data Quality
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Performance Charts
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Fuel Efficiency Trend
                  </Typography>
                  <Box sx={{ height: 200, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Line Chart Placeholder</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Distribution
                  </Typography>
                  <Box sx={{ height: 200, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Bar Chart Placeholder</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Key Insights
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
              <ListItemText 
                primary="Fuel efficiency improved by 12% over the last month"
                secondary="This is primarily due to better route planning and driver training"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><WarningIcon color="warning" /></ListItemIcon>
              <ListItemText 
                primary="Vehicle V002 shows declining performance"
                secondary="Consider scheduling maintenance or driver retraining"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
              <ListItemText 
                primary="Route R003 is the most efficient"
                secondary="Use this route as a template for similar deliveries"
              />
            </ListItem>
          </List>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Export Options
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ cursor: 'pointer' }} onClick={() => onExport('pdf')}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ExportIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6">PDF Report</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete analysis report
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ cursor: 'pointer' }} onClick={() => onExport('excel')}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TableIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6">Excel Data</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Raw data export
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ cursor: 'pointer' }} onClick={() => onExport('csv')}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <DownloadIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6">CSV Export</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Processed data
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ cursor: 'pointer' }} onClick={() => onExport('json')}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AnalyticsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6">JSON API</Typography>
                  <Typography variant="body2" color="text.secondary">
                    API integration
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onNewAnalysis}>
          New Analysis
        </Button>
        <Button variant="contained" onClick={() => onExport('pdf')}>
          Export Report
        </Button>
      </Box>
    </Paper>
  );
};

// Main Data Analysis Workflow Component
const DataAnalysisWorkflowDemo = () => {
  const [currentStep, setCurrentStep] = useState('selection');
  const [selectedType, setSelectedType] = useState(null);
  const [analysisConfig, setAnalysisConfig] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);

  const handleSelectType = (typeId) => {
    setSelectedType(typeId);
    setCurrentStep('configuration');
  };

  const handleConfigure = (config) => {
    setAnalysisConfig(config);
    setCurrentStep('execution');
  };

  const handleRunAnalysis = () => {
    setIsRunning(true);
    // Simulate analysis running
    setTimeout(() => {
      setIsRunning(false);
      setResults({ id: 'R001', name: 'Analysis Results', insights: 12 });
      setCurrentStep('results');
    }, 3000);
  };

  const handleExport = (format) => {
    console.log(`Exporting as ${format}`);
    // In real app, this would trigger actual export
  };

  const handleNewAnalysis = () => {
    setCurrentStep('selection');
    setSelectedType(null);
    setAnalysisConfig(null);
    setResults(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'selection':
        return <AnalysisTypeSelection onSelectType={handleSelectType} selectedType={selectedType} />;
      case 'configuration':
        return (
          <DataSourceConfiguration 
            selectedType={selectedType}
            onConfigure={handleConfigure}
            onBack={() => setCurrentStep('selection')}
          />
        );
      case 'execution':
        return (
          <AnalysisExecution 
            analysisConfig={analysisConfig}
            onRun={handleRunAnalysis}
            onBack={() => setCurrentStep('configuration')}
            isRunning={isRunning}
          />
        );
      case 'results':
        return (
          <ResultsAndInsights 
            results={results}
            onExport={handleExport}
            onNewAnalysis={handleNewAnalysis}
          />
        );
      default:
        return <AnalysisTypeSelection onSelectType={handleSelectType} selectedType={selectedType} />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Data Analysis Workflow
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Complete data analysis workflow for transportation analytics
      </Typography>

      <Stepper activeStep={['selection', 'configuration', 'execution', 'results'].indexOf(currentStep)} sx={{ mb: 4 }}>
        <Step>
          <StepLabel>Select Analysis Type</StepLabel>
        </Step>
        <Step>
          <StepLabel>Configure Data Sources</StepLabel>
        </Step>
        <Step>
          <StepLabel>Run Analysis</StepLabel>
        </Step>
        <Step>
          <StepLabel>Review Results</StepLabel>
        </Step>
      </Stepper>

      {renderCurrentStep()}
    </Box>
  );
};

export default {
  title: 'Workflows/DataAnalysis',
  component: DataAnalysisWorkflowDemo,
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
  render: () => <DataAnalysisWorkflowDemo />,
};

export const AnalysisTypeSelection = {
  render: () => <AnalysisTypeSelection onSelectType={() => {}} selectedType={null} />,
};

export const DataSourceConfiguration = {
  render: () => (
    <DataSourceConfiguration 
      selectedType="fuel"
      onConfigure={() => {}}
      onBack={() => {}}
    />
  ),
};

export const AnalysisExecution = {
  render: () => (
    <AnalysisExecution 
      analysisConfig={{
        type: 'fuel',
        sources: ['vehicles', 'fuel'],
        dateRange: [30, 90],
        filters: { vehicleTypes: ['truck'], drivers: ['all'], routes: [] }
      }}
      onRun={() => {}}
      onBack={() => {}}
      isRunning={false}
    />
  ),
};

export const ResultsAndInsights = {
  render: () => (
    <ResultsAndInsights 
      results={{ id: 'R001', name: 'Test Results', insights: 5 }}
      onExport={() => {}}
      onNewAnalysis={() => {}}
    />
  ),
};
