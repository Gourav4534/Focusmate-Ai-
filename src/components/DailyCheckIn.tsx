import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Slider,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { Progress } from '../types/goal';

interface DailyCheckInProps {
  onSubmit: (progress: Omit<Progress, 'date'>) => void;
  tasks: { id: string; description: string }[];
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ onSubmit, tasks }) => {
  const [mood, setMood] = useState<number>(5);
  const [focus, setFocus] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleTaskToggle = (taskId: string) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      mood,
      focus,
      completedTasks,
      notes: notes || undefined,
    });
    // Reset form
    setMood(5);
    setFocus(5);
    setNotes('');
    setCompletedTasks([]);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Daily Check-In
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>How are you feeling today?</Typography>
              <Slider
                value={mood}
                onChange={(_, value) => setMood(value as number)}
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>How focused were you today?</Typography>
              <Slider
                value={focus}
                onChange={(_, value) => setFocus(value as number)}
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Completed Tasks</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {tasks.map((task) => (
                  <Box
                    key={task.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      border: '1px solid',
                      borderColor: completedTasks.includes(task.id)
                        ? 'success.main'
                        : 'divider',
                      borderRadius: 1,
                    }}
                    onClick={() => handleTaskToggle(task.id)}
                  >
                    <Typography
                      sx={{
                        textDecoration: completedTasks.includes(task.id)
                          ? 'line-through'
                          : 'none',
                        color: completedTasks.includes(task.id)
                          ? 'text.secondary'
                          : 'text.primary',
                      }}
                    >
                      {task.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Submit Check-In
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default DailyCheckIn; 