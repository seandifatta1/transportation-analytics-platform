import React from 'react';
import { FleetEfficiencyChart } from './FleetEfficiencyChart';

export default {
  title: 'Components/Charts/FleetEfficiencyChart',
  component: FleetEfficiencyChart,
};

export const Default = {
  args: {
    data: {
      efficiency: [85, 78, 92, 81, 75, 88, 90],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    title: "Fleet Efficiency"
  }
};

export const Empty = {
  args: {
    data: null,
    title: "No Data"
  }
};
