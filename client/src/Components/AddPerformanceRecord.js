import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const AddPerformanceRecord = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        vehicleId: '',
        metricName: '',
        metricValue: '',
        unit: '',
        notes: ''
    });

    const handleChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        setFormData({
            vehicleId: '',
            metricName: '',
            metricValue: '',
            unit: '',
            notes: ''
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <AddIcon sx={{ mr: 1 }} />
                    Add Performance Record
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Vehicle</InputLabel>
                        <Select
                            value={formData.vehicleId}
                            onChange={handleChange('vehicleId')}
                            label="Vehicle"
                        >
                            <MenuItem value="1">Vehicle 1</MenuItem>
                            <MenuItem value="2">Vehicle 2</MenuItem>
                            <MenuItem value="3">Vehicle 3</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Metric Name"
                        value={formData.metricName}
                        onChange={handleChange('metricName')}
                        placeholder="e.g., Fuel Efficiency, Speed, Distance"
                    />
                    
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Metric Value"
                        type="number"
                        value={formData.metricValue}
                        onChange={handleChange('metricValue')}
                    />
                    
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Unit"
                        value={formData.unit}
                        onChange={handleChange('unit')}
                        placeholder="e.g., MPG, MPH, Miles"
                    />
                    
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Notes"
                        multiline
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange('notes')}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    Add Record
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPerformanceRecord;

