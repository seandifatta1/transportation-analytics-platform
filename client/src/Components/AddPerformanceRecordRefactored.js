import * as React from "react";
import { useState, useContext } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { RawDataContext } from "../GlobalComponents";
import { useAuth } from "../contexts/AuthContext";
import { useServices } from "../hooks/useServices";

export default function AddPerformanceRecordRefactored() {
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const { dataService, notificationService } = useServices();
    const { refreshData } = useContext(RawDataContext);

    const [vehicleId, setVehicleId] = useState("");
    const [routeId, setRouteId] = useState("");
    const [driverId, setDriverId] = useState("");
    const [metricName, setMetricName] = useState("");
    const [metricValue, setMetricValue] = useState("");
    const [unit, setUnit] = useState("");
    const [notes, setNotes] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        // Clear form fields
        setVehicleId("");
        setRouteId("");
        setDriverId("");
        setMetricName("");
        setMetricValue("");
        setUnit("");
        setNotes("");
    };

    const handleSubmit = async () => {
        if (!user || !user.id) {
            notificationService.showError("User not authenticated.");
            return;
        }

        const newPerformanceRecord = {
            vehicle_id: parseInt(vehicleId),
            route_id: parseInt(routeId), // Assuming route_id is needed for session creation
            driver_id: parseInt(driverId),
            metric_name: metricName,
            metric_value: parseFloat(metricValue),
            unit: unit,
            notes: notes,
            recorded_at: new Date().toISOString(),
        };

        try {
            await dataService.addPerformanceRecord(newPerformanceRecord);
            notificationService.showSuccess("Performance record added successfully!");
            refreshData(); // Refresh data in the parent component
            handleClose();
        } catch (error) {
            console.error("Error adding performance record:", error);
            notificationService.showError("Failed to add performance record.");
        }
    };

    return (
        <React.Fragment>
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleClickOpen}
                sx={{ position: "fixed", bottom: 16, right: 16 }}
            >
                <AddIcon />
            </Fab>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Performance Record</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="vehicleId"
                        label="Vehicle ID"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={vehicleId}
                        onChange={(e) => setVehicleId(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="routeId"
                        label="Route ID (for session)"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={routeId}
                        onChange={(e) => setRouteId(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="driverId"
                        label="Driver ID"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={driverId}
                        onChange={(e) => setDriverId(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="metricName"
                        label="Metric Name (e.g., Fuel Efficiency)"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={metricName}
                        onChange={(e) => setMetricName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="metricValue"
                        label="Metric Value"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={metricValue}
                        onChange={(e) => setMetricValue(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="unit"
                        label="Unit (e.g., mpg, miles, hours)"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="notes"
                        label="Notes"
                        type="text"
                        fullWidth
                        multiline
                        rows={2}
                        variant="standard"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Add Record</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
