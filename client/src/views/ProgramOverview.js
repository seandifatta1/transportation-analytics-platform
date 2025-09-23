import * as React from 'react';
import Box from '@mui/material/Box';
import GlobalComponents, {RawDataContext, ScreenContext} from "../GlobalComponents";
import {useLocation} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import Link from "@mui/material/Link";
import {Title} from "@mui/icons-material";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
// import { DataGrid } from '@mui/x-data-grid';

// const columns = [
//     { field: 'id', headerName: 'ID', width: 90 },
//     {
//         field: 'firstName',
//         headerName: 'First name',
//         width: 150,
//         editable: true,
//     },
//     {
//         field: 'lastName',
//         headerName: 'Last name',
//         width: 150,
//         editable: true,
//     },
//     {
//         field: 'age',
//         headerName: 'Age',
//         type: 'number',
//         width: 110,
//         editable: true,
//     },
//     {
//         field: 'fullName',
//         headerName: 'Full name',
//         description: 'This column has a value getter and is not sortable.',
//         sortable: false,
//         width: 160,
//         valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
//     },
// ];
//
// const rows = [
//     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
//     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
//     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
//     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
//     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

// export function ProgramOverview() {
//     return (
//         <Box sx={{ height: 400, width: '100%' }}>
//             {/*<DataGrid*/}
//             {/*    rows={rows}*/}
//             {/*    columns={columns}*/}
//             {/*    initialState={{*/}
//             {/*        pagination: {*/}
//             {/*            paginationModel: {*/}
//             {/*                pageSize: 5,*/}
//             {/*            },*/}
//             {/*        },*/}
//             {/*    }}*/}
//             {/*    pageSizeOptions={[5]}*/}
//             {/*    checkboxSelection*/}
//             {/*    disableRowSelectionOnClick*/}
//             {/*/>*/}
//         </Box>
//     );
// }


export function ProgramOverview() {

    const [rawData, setRawData] = useContext(RawDataContext)

    function formatData() {

        let formattedData = []
        rawData.forEach((set, index) => {
            formattedData.push({
                    id: index,
                    Exercise: set.Exercise,
                    Substitution: set.Substitution,
                    Reps: set.Reps,
                    Weight: set.Weight,
                    Notes: set.Notes
                }
            )
        });

        return formattedData
    }

    const [currentScreen, setCurrentScreen] = useContext(ScreenContext)

    setCurrentScreen("Program Overview")

    const locator = useLocation();

    const programName = parsePathForName(locator.pathname)

    console.log()

    const rows = []

    const columns = [
        // { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'Exercise',
            headerName: 'Exercise',
            width: 150,
            editable: false,
        },
        {
            field: 'Substitution',
            headerName: 'Substitution',
            width: 150,
            editable: false,
        },
        {
            field: 'Weight',
            headerName: 'Weight',
            type: 'number',
            width: 110,
            editable: false,
        },
        {
            field: 'Reps',
            headerName: 'Reps',
            type: 'number',
            width: 110,
            editable: false,
        },
        {
            field: 'Notes',
            headerName: 'Notes',
            width: 150,
            editable: false,
        },

    ];


    return (
        <Box sx={{height: 800, width: '100%'}}>
            <DataGrid
                rows={formatData()}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 15,
                        },
                    },
                }}
                pageSizeOptions={[15]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );

    return (
        <>
            {/*<Title>Recent Orders</Title>*/}
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Exercise</TableCell>
                        <TableCell>Substitution</TableCell>
                        <TableCell>Weight</TableCell>
                        <TableCell>Reps</TableCell>
                        <TableCell>Day</TableCell>
                        <TableCell>Notes</TableCell>
                        {/*<TableCell align="right">Sale Amount</TableCell>*/}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rawData.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.Exercise}</TableCell>
                            <TableCell>{row.Substitution}</TableCell>
                            <TableCell>{row.Weight}</TableCell>
                            <TableCell>{row.Reps}</TableCell>
                            <TableCell>{row.Day}</TableCell>
                            <TableCell>{row.Notes}</TableCell>
                            {/*<TableCell align="right">{`$${row.amount}`}</TableCell>*/}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/*<Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>*/}
            {/*    See more orders*/}
            {/*</Link>*/}
        </>
    );

}

function parsePathForName(programName) {

    const splitPath = programName.split("/");
    const numberOfPathElements = programName.split("/").length;
    const final = splitPath[numberOfPathElements - 1];

    let name = final.replaceAll("%20", " ")

    return name

}