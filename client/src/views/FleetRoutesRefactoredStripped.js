import React from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Button, 
    Grid, 
    Chip, 
    Stack, 
    Box,
    IconButton
} from '@mui/material';
import {
    Add as AddIcon,
    DirectionsCar as DirectionsCarIcon
} from '@mui/icons-material';

const FleetRoutesRefactoredStripped = () => {
    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                Fleet Routes - Completely Static
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                This component has ZERO dynamic elements - no hooks, no state, no data mapping.
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Routes: 3 found
                            </Typography>
                            
                            {/* Completely static - no mapping, no dynamic data */}
                            <Box sx={{ mt: 2 }}>
                                <Card sx={{ mb: 1, p: 1 }}>
                                    <Typography variant="body2">
                                        City Delivery - ACTIVE
                                    </Typography>
                                </Card>
                                <Card sx={{ mb: 1, p: 1 }}>
                                    <Typography variant="body2">
                                        Highway Haul - INACTIVE
                                    </Typography>
                                </Card>
                                <Card sx={{ mb: 1, p: 1 }}>
                                    <Typography variant="body2">
                                        Local Pickup - ACTIVE
                                    </Typography>
                                </Card>
                            </Box>
                            
                            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                <Chip 
                                    icon={<DirectionsCarIcon />}
                                    label="Static Chip" 
                                    color="primary" 
                                />
                                <IconButton color="primary">
                                    <AddIcon />
                                </IconButton>
                                <Button variant="contained" color="primary">
                                    Static Button
                                </Button>
                                <Button variant="outlined" color="secondary">
                                    Another Button
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FleetRoutesRefactoredStripped;
