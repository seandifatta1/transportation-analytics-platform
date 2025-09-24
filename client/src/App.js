import React from "react"
import {Navigate, Route, Routes, useNavigate} from "react-router-dom"
import {Login, SignUp} from "./components/Login"
import GlobalComponents from "./GlobalComponents";
// import {ProgramOverview} from "./views/ProgramOverview"; // Removed - file doesn't exist
import FleetRoutes from "./views/FleetRoutes";
import {WeeklyFleetAnalysis} from "./views/WeeklyFleetAnalysis";
import WeeklyFleetAnalysisRefactored from "./views/WeeklyFleetAnalysisRefactored";
import {MonthlyFleetTrends} from "./views/MonthlyFleetTrends";
import MonthlyFleetTrendsRefactored from "./views/MonthlyFleetTrendsRefactored";
import {VehicleAnalysis} from "./views/VehicleAnalysis";
import VehicleAnalysisRefactored from "./views/VehicleAnalysisRefactored";
import { AuthProvider } from "./contexts/AuthContext";
import { ServiceProvider } from "./contexts/ServiceContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App(defaultValue) {


    const navigate = useNavigate();


    return (
        <ServiceProvider config={{ baseUrl: process.env.REACT_APP_BASE_URL }}>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/Dashboard/ThisWeek" replace/>}/>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/Login" element={<Login />}/>
                    <Route path="/SignUp" element={<SignUp/>}/>
                    <Route path="/signup" element={<SignUp/>}/>

                    <Route path="/Dashboard" element={
                        <ProtectedRoute>
                            <GlobalComponents/>
                        </ProtectedRoute>
                    }>
                        <Route path="ThisWeek" element={<WeeklyFleetAnalysisRefactored/>}/>
                        <Route path="WeeklyFleetAnalysis" element={<WeeklyFleetAnalysisRefactored/>}/>

                        <Route path="ThisMonth" element={<MonthlyFleetTrendsRefactored/>}/>
                        <Route path="MonthlyFleetTrends" element={<MonthlyFleetTrendsRefactored/>}/>

                        <Route path="SpecificExercise" element={<VehicleAnalysisRefactored/>}/>
                        <Route path="SpecificExercise/:exercise" element={<VehicleAnalysisRefactored/>}/>
                        <Route path="VehicleAnalysis" element={<VehicleAnalysisRefactored/>}/>
                        <Route path="VehicleAnalysis/:vehicleId" element={<VehicleAnalysisRefactored/>}/>

                        {/* <Route path="ProgramOverview" element={<ProgramOverview/>}/> */}

                        <Route path="MyPrograms" element={<FleetRoutes/>}/>
                        <Route path="MyPrograms/:programName" element={<FleetRoutes/>}/>
                        <Route path="FleetRoutes" element={<FleetRoutes/>}/>
                    </Route>
                </Routes>
            </AuthProvider>
        </ServiceProvider>
    )

}

export default App
