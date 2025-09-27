import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { CustomAppBar, CustomDrawer, defaultTheme } from './globals';
import { TransportationListItems } from './TransportationListItems';

// Create theme from defaultTheme
const theme = createTheme(defaultTheme);

export default {
  title: 'Components/Globals',
  component: CustomAppBar,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <Story />
        </Box>
      </ThemeProvider>
    ),
  ],
};

export const AppBarOnly = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    return (
      <Box sx={{ flexGrow: 1 }}>
        <CustomAppBar 
          open={open} 
          handleDrawerOpen={() => setOpen(true)}
          title="Fleet Management Dashboard"
        />
        <Box sx={{ p: 3, mt: 8 }}>
          <h2>Main Content Area</h2>
          <p>This is where the main content would go.</p>
        </Box>
      </Box>
    );
  },
};

export const DrawerOnly = {
  render: () => {
    const [open, setOpen] = useState(true);
    
    return (
      <>
        <CustomDrawer 
          open={open} 
          handleDrawerClose={() => setOpen(false)}
        >
          <TransportationListItems />
        </CustomDrawer>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <h2>Main Content Area</h2>
          <p>This is where the main content would go.</p>
        </Box>
      </>
    );
  },
};

export const AppBarWithDrawer = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    return (
      <>
        <CustomAppBar 
          open={open} 
          handleDrawerOpen={() => setOpen(true)}
          title="Transportation Analytics"
        />
        <CustomDrawer 
          open={open} 
          handleDrawerClose={() => setOpen(false)}
        >
          <TransportationListItems />
        </CustomDrawer>
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            mt: 8,
            transition: 'margin 0.3s',
            marginLeft: open ? '240px' : 0
          }}
        >
          <h2>Main Content Area</h2>
          <p>This demonstrates the full layout with both AppBar and Drawer.</p>
          <p>Click the menu button to toggle the drawer.</p>
        </Box>
      </>
    );
  },
};

export const InteractiveLayout = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    return (
      <>
        <CustomAppBar 
          open={open} 
          handleDrawerOpen={() => setOpen(true)}
          title="Interactive Dashboard"
        />
        <CustomDrawer 
          open={open} 
          handleDrawerClose={() => setOpen(false)}
        >
          <TransportationListItems />
        </CustomDrawer>
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            mt: 8,
            transition: 'margin 0.3s',
            marginLeft: open ? '240px' : 0
          }}
        >
          <h2>Interactive Layout Demo</h2>
          <p>Current drawer state: {open ? 'Open' : 'Closed'}</p>
          <button onClick={() => setOpen(!open)}>
            Toggle Drawer
          </button>
        </Box>
      </>
    );
  },
};

export const DifferentTitles = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [currentTitle, setCurrentTitle] = useState('Fleet Management');
    
    const titles = [
      'Fleet Management',
      'Transportation Analytics',
      'Vehicle Performance',
      'Route Optimization'
    ];
    
    return (
      <>
        <CustomAppBar 
          open={open} 
          handleDrawerOpen={() => setOpen(true)}
          title={currentTitle}
        />
        <CustomDrawer 
          open={open} 
          handleDrawerClose={() => setOpen(false)}
        >
          <TransportationListItems />
        </CustomDrawer>
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            mt: 8,
            transition: 'margin 0.3s',
            marginLeft: open ? '240px' : 0
          }}
        >
          <h2>Title Demo</h2>
          <p>Current title: <strong>{currentTitle}</strong></p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {titles.map((title) => (
              <button 
                key={title}
                onClick={() => setCurrentTitle(title)}
                style={{ 
                  padding: '8px 16px', 
                  margin: '4px',
                  backgroundColor: currentTitle === title ? '#1976d2' : '#f5f5f5',
                  color: currentTitle === title ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {title}
              </button>
            ))}
          </div>
        </Box>
      </>
    );
  },
};
