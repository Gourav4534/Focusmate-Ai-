import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Container } from '@mui/material';
import { setGoal } from '../store/goalSlice';

interface GoalData {
  goal: string;
  motivation: string;
  consequences: string;
  benefits: string;
}

const GoalSetting: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [goalData, setGoalData] = useState<GoalData>({
    goal: '',
    motivation: '',
    consequences: '',
    benefits: '',
  });

  const handleChange = (field: keyof GoalData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGoalData({ ...goalData, [field]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setGoal(goalData));
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Set Your Goal
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="What is your most important goal?"
            value={goalData.goal}
            onChange={handleChange('goal')}
            margin="normal"
            multiline
            rows={2}
            required
          />
          <TextField
            fullWidth
            label="Why is this goal important to you?"
            value={goalData.motivation}
            onChange={handleChange('motivation')}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            label="What are the consequences of not achieving this goal?"
            value={goalData.consequences}
            onChange={handleChange('consequences')}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            label="What benefits will you gain from achieving this goal?"
            value={goalData.benefits}
            onChange={handleChange('benefits')}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Set Goal
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default GoalSetting; 