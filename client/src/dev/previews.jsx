import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import FleetRoutes from "../views/FleetRoutes";
import AddNewProgram from "../views/FleetRoutes";
import SetInputDialogFab from "../components/AddPerformanceRecord";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/AddNewProgram">
                <AddNewProgram/>
            </ComponentPreview>
            <ComponentPreview path="/SetInputDialogFab">
                <SetInputDialogFab/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews