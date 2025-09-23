import React from "react"
import {Navigate, Route, Routes, useNavigate} from "react-router-dom"
import {Login, SignUp} from "./Components/Login"
import GlobalComponents from "./GlobalComponents";
import {ProgramOverview} from "./views/ProgramOverview";
import ProgramCards from "./views/ProgramCards";
import {ThisWeek} from "./views/ThisWeek";
import {ThisMonth} from "./views/ThisMonth";
import {SpecificExercise} from "./views/SpecificExercise";

function App(defaultValue) {


    const navigate = useNavigate();


    return (<Routes>


            <Route path="/Login" element={<Login />}/>
            <Route path="/SignUp" element={<SignUp/>}/>
            <Route index element={<Navigate to="/Login" replace/>}/>

            {/*<Route index element={<Navigate to="/Dashboard/ThisWeek" replace/>}/>*/}



            <Route path="/Dashboard" element={<GlobalComponents/>}>

                <Route path="ThisWeek" element={<ThisWeek/>}/>

                <Route path="ThisMonth" element={<ThisMonth/>}/>

                <Route path="SpecificExercise" element={<SpecificExercise/>}/>
                <Route path="SpecificExercise/:exercise" element={<SpecificExercise/>}/>

                <Route path="ProgramOverview" element={<ProgramOverview/>}/>

                <Route path="MyPrograms" element={<ProgramCards/>}/>
                <Route path="MyPrograms/:programName" element={<ProgramOverview/>}/>
            </Route>
        </Routes>


    )

}

export default App
