import React from 'react';
import { FleetPerformanceChart } from './FleetPerformanceChart';

export default {
  title: 'Components/Charts/FleetPerformanceChart',
  component: FleetPerformanceChart,
};

export const Default = {
  args: {
    data: {
      performance: [8.5, 7.8, 9.2, 8.1, 7.5],
      labels: ['V001', 'V002', 'V003', 'V004', 'V005']
    },
    title: "Fleet Performance"
  }
};

export const Empty = {
  args: {
    data: null,
    title: "No Data"
  }
};
