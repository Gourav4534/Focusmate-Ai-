import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import { 
  EmojiEvents as AchievementIcon,
  TrendingUp as ProgressIcon,
  Favorite as HeartIcon,
  DirectionsBike as CyclingIcon
} from '@mui/icons-material';
import { RootState } from '../store';
import { aiService } from '../services/aiService';

const AIAssistant: React.FC = () => {
  const { currentGoal } = useSelector((state: RootState) => state.goal);
  const [motivationalMessage, setMotivationalMessage] = useState<string>('');
  const [progressInsight, setProgressInsight] = useState<string>('');
  const [personalizedNudge, setPersonalizedNudge] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAIInsights = async () => {
    if (!currentGoal) {
      console.log('No current goal found');
      return;
    }

    console.log('Fetching AI insights for goal:', currentGoal);
    setIsLoading(true);
    setError(null);

    try {
      const [message, insight, nudge] = await Promise.all([
        aiService.getMotivationalMessage(currentGoal),
        aiService.analyzeProgress(currentGoal, currentGoal.progress),
        aiService.getPersonalizedNudge(currentGoal, currentGoal.progress),
      ]);

      console.log('Received AI responses:', { message, insight, nudge });
      
      setMotivationalMessage(message);
      setProgressInsight(insight);
      setPersonalizedNudge(nudge);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch AI insights');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, [currentGoal]);

  if (!currentGoal) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <CyclingIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No goal set yet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Set a goal to get AI-powered insights and suggestions.
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchAIInsights}>
          Try Again
        </Button>
      </Paper>
    );
  }

  if (isLoading) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ mr: 2 }} />
          <Typography>Getting AI insights...</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          <CyclingIcon />
        </Avatar>
        <Typography variant="h5" component="h2">
          Your AI Assistant
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HeartIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" color="primary">
              Motivation Boost
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ pl: 4 }}>
            {motivationalMessage}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ProgressIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" color="primary">
              Progress Insight
            </Typography>
          </Box>
          <List>
            {progressInsight.split('\n').map((point, index) => (
              point.trim() && (
                <ListItem key={index} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <AchievementIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={point.trim()} />
                </ListItem>
              )
            ))}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HeartIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" color="primary">
              Personalized Message
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ pl: 4 }}>
            {personalizedNudge}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button 
          variant="outlined" 
          onClick={fetchAIInsights}
          startIcon={<CyclingIcon />}
        >
          Refresh Insights
        </Button>
      </Box>
    </Paper>
  );
};

export default AIAssistant; 