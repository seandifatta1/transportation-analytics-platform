import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

// Simplified version of GlobalComponents for Storybook
// This strips out all the complex context and API stuff
const SimpleGlobalComponents = ({ user = null }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Transportation Analytics Platform
      </Typography>
      <Typography variant="body1">
        GlobalComponents loaded successfully! User: {user?.email || 'Not logged in'}
      </Typography>
      <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
        <Typography variant="h6">Outlet Content</Typography>
        <Typography variant="body2">
          This would normally render child routes
        </Typography>
      </Box>
    </Box>
  );
};

export default {
  title: 'Components/GlobalComponents',
  component: SimpleGlobalComponents,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Box sx={{ p: 2 }}>
          <Story />
        </Box>
      </BrowserRouter>
    ),
  ],
};

export const Default = {
  render: () => <SimpleGlobalComponents />,
};

export const WithUser = {
  render: () => (
    <SimpleGlobalComponents 
      user={{ id: '1', email: 'test@example.com' }} 
    />
  ),
};

export const NotAuthenticated = {
  render: () => <SimpleGlobalComponents user={null} />,
};

export const AdminUser = {
  render: () => (
    <SimpleGlobalComponents 
      user={{ id: '2', email: 'admin@example.com' }} 
    />
  ),
};