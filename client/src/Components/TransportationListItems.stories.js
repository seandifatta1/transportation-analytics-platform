import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import DrawerItems, { Favorites, Programs, Snapshots } from './TransportationListItems';

export default {
  title: 'Components/TransportationListItems',
  component: DrawerItems,
  decorators: [
    (Story) => (
      <Box sx={{ width: 250, bgcolor: 'background.paper', p: 2 }}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    layout: 'padded',
  },
};

export const AllItems = {
  render: () => <DrawerItems />,
};

export const FavoritesOnly = {
  render: () => (
    <Paper elevation={1} sx={{ p: 1 }}>
      <Favorites />
    </Paper>
  ),
};

export const ProgramsOnly = {
  render: () => (
    <Paper elevation={1} sx={{ p: 1 }}>
      <Programs />
    </Paper>
  ),
};

export const SnapshotsOnly = {
  render: () => (
    <Paper elevation={1} sx={{ p: 1 }}>
      <Snapshots />
    </Paper>
  ),
};

export const InDrawer = {
  render: () => (
    <Paper elevation={3} sx={{ width: 240, height: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h6">Navigation</Typography>
      </Box>
      <DrawerItems />
    </Paper>
  ),
};
