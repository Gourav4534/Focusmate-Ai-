import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Task } from '../types/goal';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'error.main';
      case 'medium':
        return 'warning.main';
      case 'low':
        return 'success.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Paper elevation={2} sx={{ mt: 2 }}>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Tasks
        </Typography>
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              divider
              sx={{
                backgroundColor: task.completed ? 'action.hover' : 'background.paper',
              }}
            >
              <Checkbox
                edge="start"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
              />
              <ListItemText
                primary={task.description}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color={getPriorityColor(task.priority)}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </Typography>
                    {task.dueDate && (
                      <Typography component="span" variant="body2" color="text.secondary">
                        {' • Due: ' + new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => onEdit(task.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => onDelete(task.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default TaskList; 