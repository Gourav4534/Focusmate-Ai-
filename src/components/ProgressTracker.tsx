import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Progress } from '../types/goal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressTrackerProps {
  progress: Progress[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress }) => {
  const chartData = {
    labels: progress.map((p) => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Mood',
        data: progress.map((p) => p.mood),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Focus',
        data: progress.map((p) => p.focus),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
  };

  const calculateAverage = (data: number[]) => {
    if (data.length === 0) return 0;
    return data.reduce((a, b) => a + b, 0) / data.length;
  };

  const averageMood = calculateAverage(progress.map((p) => p.mood));
  const averageFocus = calculateAverage(progress.map((p) => p.focus));

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Progress Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Mood Trend
              </Typography>
              <Line data={chartData} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Average Mood
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(averageMood / 10) * 100}
                    sx={{ flexGrow: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {averageMood.toFixed(1)}/10
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Average Focus
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(averageFocus / 10) * 100}
                    sx={{ flexGrow: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {averageFocus.toFixed(1)}/10
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProgressTracker; 