import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const FleetRoutesRefactoredMinimal = () => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">
                    Fleet Routes - Minimal Version
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    This is a minimal version of the FleetRoutes component for testing.
                </Typography>
                <Button variant="contained" color="primary">
                    Test Button
                </Button>
            </CardContent>
        </Card>
    );
};

export default FleetRoutesRefactoredMinimal;
