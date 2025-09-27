import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { 
  Favorites, 
  Programs, 
  Snapshots, 
  default as DrawerItems 
} from './TransportationListItems';

export default {
  title: 'Components/TransportationListItems',
  component: DrawerItems,
  decorators: [
    (Story) => (
      <Box sx={{ p: 2, maxWidth: 300 }}>
        <Story />
      </Box>
    ),
  ],
};

export const AllItems = {
  render: () => <DrawerItems />,
};

export const FavoritesOnly = {
  render: () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Favorites
      </Typography>
      <Favorites />
    </Box>
  ),
};

export const ProgramsOnly = {
  render: () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Programs
      </Typography>
      <Programs />
    </Box>
  ),
};

export const SnapshotsOnly = {
  render: () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Snapshots
      </Typography>
      <Snapshots />
    </Box>
  ),
};

export const InDrawer = {
  render: () => (
    <Paper sx={{ width: 280, height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Navigation Menu
        </Typography>
        <DrawerItems />
      </Box>
    </Paper>
  ),
};

export const WithClickHandlers = {
  render: () => {
    const handleItemClick = (itemName) => {
      console.log(`Clicked: ${itemName}`);
      alert(`You clicked: ${itemName}`);
    };

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Interactive Navigation
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Favorites
          </Typography>
          <Favorites />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Programs
          </Typography>
          <Programs />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Snapshots
          </Typography>
          <Snapshots />
        </Box>
      </Box>
    );
  },
};
