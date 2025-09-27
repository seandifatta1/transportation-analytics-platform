import React, { useState } from 'react';
import AddPerformanceRecord from './AddPerformanceRecord';
import { Button, Box, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

// Wrapper component to demonstrate the dialog in action
const DialogWrapper = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const handleSubmit = (data) => {
    console.log('Performance record submitted:', data);
    setSubmittedData(data);
    setOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Performance Record Demo
      </Typography>
      
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add Performance Record
      </Button>
      
      {submittedData && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Last Submitted Data:
          </Typography>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </Box>
      )}
      
      {children({ open, onClose: handleClose, onSubmit: handleSubmit })}
    </Box>
  );
};

export default {
  title: 'Components/AddPerformanceRecord',
  component: AddPerformanceRecord,
};

export const Default = {
  render: () => (
    <DialogWrapper>
      {({ open, onClose, onSubmit }) => (
        <AddPerformanceRecord
          open={open}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </DialogWrapper>
  ),
};

export const AlwaysOpen = {
  render: () => (
    <AddPerformanceRecord
      open={true}
      onClose={() => console.log('Close clicked')}
      onSubmit={(data) => console.log('Submit clicked:', data)}
    />
  ),
};

export const WithInitialData = {
  render: () => {
    const [open, setOpen] = useState(true);
    
    return (
      <AddPerformanceRecord
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => {
          console.log('Submitted with data:', data);
          setOpen(false);
        }}
      />
    );
  },
};
