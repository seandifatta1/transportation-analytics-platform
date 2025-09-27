import React from 'react';
import Title from './Title';

export default {
  title: 'Components/Title',
  component: Title,
};

export const Default = {
  render: () => <Title>Fleet Management Dashboard</Title>
};

export const LongTitle = {
  render: () => <Title>Transportation Analytics Platform - Monthly Fleet Trends</Title>
};
