import React from 'react';
import { TimeSeriesChart } from './TimeSeriesChart';

export default {
  title: 'Components/Charts/TimeSeriesChart',
  component: TimeSeriesChart,
};

export const Default = {
  args: {
    data: {
      series: [
        { x: 1, y: 8.5 },
        { x: 2, y: 7.8 },
        { x: 3, y: 9.2 },
        { x: 4, y: 8.1 },
        { x: 5, y: 7.5 },
        { x: 6, y: 8.8 },
        { x: 7, y: 9.0 }
      ]
    },
    title: "Performance Over Time"
  }
};

export const Empty = {
  args: {
    data: null,
    title: "No Data"
  }
};
