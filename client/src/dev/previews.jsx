import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import ProgramCards from "../views/ProgramCards";
import AddNewProgram from "../views/ProgramCards";
import SetInputDialogFab from "../Components/AddSet";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/ProgramCards">
                <ProgramCards/>
            </ComponentPreview>
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