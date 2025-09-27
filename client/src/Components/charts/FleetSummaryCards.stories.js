import React from 'react';
import { FleetSummaryCards } from './FleetSummaryCards';

export default {
  title: 'Components/Charts/FleetSummaryCards',
  component: FleetSummaryCards,
};

export const Default = {
  args: {
    summary: {
      totalVehicles: 15,
      activeVehicles: 12,
      avgFuelEfficiency: 8.5,
      totalDistance: 1250
    }
  }
};

export const Empty = {
  args: {
    summary: null
  }
};
