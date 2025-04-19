import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Fab,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { RootState } from '../store';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import DailyCheckIn from '../components/DailyCheckIn';
import ProgressTracker from '../components/ProgressTracker';
import AIAssistant from '../components/AIAssistant';
import {
  addTask,
  updateTask,
  addProgress,
} from '../store/goalSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentGoal } = useSelector((state: RootState) => state.goal);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  if (!currentGoal) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            No goal set yet
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Set Your Goal
          </Button>
        </Box>
      </Container>
    );
  }

  const handleAddTask = (task: Omit<Task, 'id' | 'completed'>) => {
    dispatch(addTask(task));
    setIsTaskFormOpen(false);
  };

  const handleToggleTask = (taskId: string) => {
    const task = currentGoal.tasks.find((t) => t.id === taskId);
    if (task) {
      dispatch(
        updateTask({
          taskId,
          updates: { completed: !task.completed },
        })
      );
    }
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(
      updateTask({
        taskId,
        updates: { deleted: true },
      })
    );
  };

  const handleEditTask = (taskId: string) => {
    setEditingTask(taskId);
    setIsTaskFormOpen(true);
  };

  const handleSubmitProgress = (progress: Omit<Progress, 'date'>) => {
    dispatch(addProgress(progress));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          {currentGoal.goal}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          {currentGoal.motivation}
        </Typography>

        <AIAssistant />

        <TaskList
          tasks={currentGoal.tasks.filter((task) => !task.deleted)}
          onToggleComplete={handleToggleTask}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
        />

        <DailyCheckIn
          onSubmit={handleSubmitProgress}
          tasks={currentGoal.tasks
            .filter((task) => !task.deleted)
            .map((task) => ({
              id: task.id,
              description: task.description,
            }))}
        />

        <ProgressTracker progress={currentGoal.progress} />

        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => {
            setEditingTask(null);
            setIsTaskFormOpen(true);
          }}
        >
          <AddIcon />
        </Fab>

        <TaskForm
          open={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          onSubmit={handleAddTask}
          initialTask={
            editingTask
              ? currentGoal.tasks.find((t) => t.id === editingTask)
              : undefined
          }
        />
      </Box>
    </Container>
  );
};

export default Dashboard; 