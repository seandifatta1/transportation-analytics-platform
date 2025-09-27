import {useContext, useEffect, useState} from "react";
import {BarChart} from "@mui/x-charts/BarChart";
import * as React from "react";
import {axisClasses} from '@mui/x-charts/ChartsAxis';
import axios from "axios";
import {
    FormControl,
    FormControlLabel,
    FormLabel, Radio,
    RadioGroup, Stack,
    Tab,
    Tabs,
    ToggleButton,
    ToggleButtonGroup,
    Card,
    CardContent,
    Typography,
    Grid,
    Box
} from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {ScreenContext} from "../GlobalComponents";
import {useCookies} from "react-cookie";
import { initializeTransportationData } from "../utils/initializeTransportationData";
import { FleetSummaryCards } from "../components/charts/FleetSummaryCards";

export function MonthlyFleetTrends() {
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
    const [currentScreen, setCurrentScreen] = useContext(ScreenContext);

    setCurrentScreen("Monthly Fleet Trends");

    const [currentTab, setCurrentTab] = useState("Delivery");
    const [fleetSummary, setFleetSummary] = useState(null);
    const [performanceData, setPerformanceData] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        // Initialize with stub data
        const stubData = initializeTransportationData();
        
        // Load fleet summary
        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/summary`, {
            withCredentials: true
        })
        .then(data => {
            setFleetSummary(data.data);
        })
        .catch(e => {
            console.log("Using stub data for summary");
            setFleetSummary(stubData.getFleetPerformanceSummary());
        });

        // Load monthly performance data
        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/time?unitOfTime=month&amount=1&from=now`, {
            withCredentials: true
        })
        .then(data => {
            setPerformanceData(data.data.lifting.rawData);
        })
        .catch(e => {
            console.log("Using stub data for performance");
            const stubPerformance = stubData.getChartData(null, 'fuel_efficiency');
            setPerformanceData(stubPerformance.map(record => ({
                Exercise: record.vehicle_name,
                Weight: record.metric_value,
                Reps: 1,
                Time: record.recorded_at,
                Day: record.session_name,
                Notes: record.notes
            })));
        });

        // Load vehicles
        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/vehicles`, {
            withCredentials: true
        })
        .then(data => {
            setVehicles(data.data);
        })
        .catch(e => {
            console.log("Using stub data for vehicles");
            setVehicles(stubData.vehicles);
        });

        // Load routes
        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/programs`, {
            withCredentials: true
        })
        .then(data => {
            setRoutes(data.data);
        })
        .catch(e => {
            console.log("Using stub data for routes");
            setRoutes(stubData.fleetRoutes.map(route => route.name));
        });
    }, []);

    // Convert performance data to transportation format
    const transportationData = performanceData.map(record => ({
        vehicle_name: record.Exercise,
        metric_name: 'fuel_efficiency', // Default to fuel efficiency
        metric_value: record.Weight,
        recorded_at: record.Time,
        session_name: record.Day,
        notes: record.Notes
    }));

    return (
        <>
            <FleetTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
            
            {/* Fleet Summary Cards */}
            <FleetSummaryCards 
                data={transportationData} 
                title="Monthly Fleet Summary" 
            />
            
            {currentTab === "Delivery" && performanceData.length > 0 ? 
                <DeliveryTrends data={transportationData} vehicles={vehicles} /> : 
                <LongHaulTrends />
            }
        </>
    );
}


function DeliveryTrends({ data, vehicles }) {
    const [selectedMetric, setSelectedMetric] = useState("fuel_efficiency");
    const [timeRange, setTimeRange] = useState("month");

    return (
        <Box sx={{ mt: 3 }}>
            <Stack spacing={3}>
                <MetricSelector 
                    selectedMetric={selectedMetric} 
                    setSelectedMetric={setSelectedMetric} 
                />
                
                <TimeRangeSelector 
                    timeRange={timeRange} 
                    setTimeRange={setTimeRange} 
                />
                
                <Grid container spacing={3}>
                    {/* Fleet Performance Chart */}
                    <Grid item xs={12} md={8}>
                        <FleetPerformanceChart 
                            data={data}
                            title="Monthly Fleet Performance"
                        />
                    </Grid>
                    
                    {/* Fleet Efficiency Analysis */}
                    <Grid item xs={12} md={4}>
                        <FleetEfficiencyChart 
                            data={data}
                            title="Efficiency Analysis"
                        />
                    </Grid>
                    
                    {/* Route Performance */}
                    <Grid item xs={12}>
                        <RoutePerformanceChart 
                            data={data}
                            title="Route Performance Analysis"
                        />
                    </Grid>
                    
                    {/* Time Series Chart */}
                    <Grid item xs={12}>
                        <TimeSeriesChart 
                            data={data}
                            title="Performance Trends This Month"
                            metric={selectedMetric}
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}

function LongHaulTrends() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Long Haul Analytics
                </Typography>
                <Typography color="textSecondary">
                    Long haul performance trends and analytics coming soon...
                </Typography>
            </CardContent>
        </Card>
    );
}


function MetricSelector({ selectedMetric, setSelectedMetric }) {
    const metrics = [
        { value: 'fuel_efficiency', label: 'Fuel Efficiency' },
        { value: 'distance_traveled', label: 'Distance Traveled' },
        { value: 'average_speed', label: 'Average Speed' },
        { value: 'idle_time', label: 'Idle Time' }
    ];

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">Performance Metric</FormLabel>
            <RadioGroup
                row
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
            >
                {metrics.map(metric => (
                    <FormControlLabel
                        key={metric.value}
                        value={metric.value}
                        control={<Radio />}
                        label={metric.label}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}

function TimeRangeSelector({ timeRange, setTimeRange }) {
    return (
        <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(e, value) => setTimeRange(value)}
            aria-label="time range"
        >
            <ToggleButton value="week" aria-label="week">
                Week
            </ToggleButton>
            <ToggleButton value="month" aria-label="month">
                Month
            </ToggleButton>
            <ToggleButton value="quarter" aria-label="quarter">
                Quarter
            </ToggleButton>
        </ToggleButtonGroup>
    );
}

function FleetTabs(props) {
    return (
        <Tabs
            value={props.currentTab}
            onChange={(e, v) => {
                props.setCurrentTab(v);
            }}
            variant="fullWidth"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="fleet type tabs"
            sx={{ mb: 3 }}
        >
            <Tab icon={<DirectionsCarIcon/>} label="Delivery" value={"Delivery"}/>
            <Tab icon={<LocalShippingIcon/>} label="Long Haul" value={"Long Haul"}/>
        </Tabs>
    );
}

