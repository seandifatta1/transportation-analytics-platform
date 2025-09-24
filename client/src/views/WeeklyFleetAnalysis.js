import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {BarChart} from "@mui/x-charts/BarChart";
import axios from "axios";
import {FormControl, FormControlLabel, ListItem, Radio, RadioGroup, Stack, Tab, Tabs, Grid, Card, CardContent} from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Box from "@mui/material/Box";
import {ScatterChart} from "@mui/x-charts";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import {FixedSizeList} from 'react-window';
import Title from "../components/Title";
import {useCookies} from "react-cookie";
import {ScreenContext} from "../GlobalComponents";
import { initializeTransportationData } from "../utils/initializeTransportationData";
import { 
    FleetPerformanceChart, 
    FleetEfficiencyChart, 
    FleetSummaryCards,
    TimeSeriesChart 
} from "../components/TransportationCharts";

export function WeeklyFleetAnalysis() {
    const [cookies,] = useCookies(['cookie-name']);
    const [currentScreen, setCurrentScreen] = useContext(ScreenContext);

    if (currentScreen !== "Weekly Fleet Analysis") {
        setCurrentScreen("Weekly Fleet Analysis");
    }

    const [currentTab, setCurrentTab] = useState("Delivery");
    const [fleetRoutes, setFleetRoutes] = useState([]);
    const [performanceData, setPerformanceData] = useState();
    const [maxData, setMaxData] = useState();
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        // Initialize with stub data for now
        const stubData = initializeTransportationData();
        
        // Load fleet routes
        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/programs`, {
            withCredentials: true
        })
        .then(data => {
            setFleetRoutes(data.data);
        })
        .catch(e => {
            console.log("Using stub data for routes");
            setFleetRoutes(stubData.fleetRoutes.map(route => route.name));
        });

        // Load performance data
        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/time?unitOfTime=week&amount=1&from=now`, {
            withCredentials: true
        })
        .then(data => {
            setPerformanceData(data.data.lifting.rawData);
            setMaxData(data.data.lifting.statistics.max);
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
            setMaxData(stubPerformance.reduce((max, record) => 
                Math.max(max, record.metric_value), 0
            ));
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
    }, []);

    return (
        <>
            <FleetTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
            
            {/* Fleet Summary Cards */}
            {performanceData && (
                <FleetSummaryCards 
                    data={performanceData} 
                    title="Weekly Fleet Summary" 
                />
            )}
            
            {currentTab === "Delivery" && performanceData ? 
                <DeliveryCharts
                    data={performanceData}
                    vehicles={vehicles}
                /> : 
                <LongHaulCharts />
            }
        </>
    );
}

function LongHaulCharts(props) {
    return (
        <>
            <Title name={"Long Haul Analytics"}></Title>
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <p>Long haul performance analytics coming soon...</p>
            </Box>
        </>
    );
}

function DeliveryCharts({ data, vehicles }) {
    const [selectedMetric, setSelectedMetric] = useState("fuel_efficiency");
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    // Convert data to transportation format
    const transportationData = data.map(record => ({
        vehicle_name: record.Exercise,
        metric_name: 'fuel_efficiency', // Default to fuel efficiency for weekly analysis
        metric_value: record.Weight,
        recorded_at: record.Time,
        session_name: record.Day,
        notes: record.Notes
    }));

    return (
        <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
                {/* Fleet Performance Chart */}
                <Grid item xs={12} md={8}>
                    <FleetPerformanceChart 
                        data={transportationData}
                        title="Weekly Fleet Performance"
                    />
                </Grid>
                
                {/* Fleet Efficiency Analysis */}
                <Grid item xs={12} md={4}>
                    <FleetEfficiencyChart 
                        data={transportationData}
                        title="Efficiency Analysis"
                    />
                </Grid>
                
                {/* Time Series Chart */}
                <Grid item xs={12}>
                    <TimeSeriesChart 
                        data={transportationData}
                        title="Performance Trends This Week"
                        metric="fuel_efficiency"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}


function FleetTabs(props) {
    return (
        <>
            <Tabs
                value={props.currentTab}
                onChange={(e, v) => {
                    props.setCurrentTab(v);
                }}
                variant="fullWidth"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="fleet type tabs"
            >
                <Tab icon={<DirectionsCarIcon/>} label="Delivery" value={"Delivery"}/>
                <Tab icon={<LocalShippingIcon/>} label="Long Haul" value={"Long Haul"}/>
            </Tabs>
        </>
    );
}

