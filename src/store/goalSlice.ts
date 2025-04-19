import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Goal, GoalState, Task, Progress } from '../types/goal';
import { v4 as uuidv4 } from 'uuid';

const initialState: GoalState = {
  currentGoal: null,
  loading: false,
  error: null,
};

const goalSlice = createSlice({
  name: 'goal',
  initialState,
  reducers: {
    setGoal: (state, action: PayloadAction<Omit<Goal, 'id' | 'createdAt' | 'tasks' | 'progress'>>) => {
      const newGoal: Goal = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        tasks: [],
        progress: [],
      };
      state.currentGoal = newGoal;
    },
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'completed'>>) => {
      if (state.currentGoal) {
        const newTask = {
          ...action.payload,
          id: uuidv4(),
          completed: false,
        };
        state.currentGoal.tasks.push(newTask);
      }
    },
    updateTask: (state, action: PayloadAction<{ taskId: string; updates: Partial<Task> }>) => {
      if (state.currentGoal) {
        const taskIndex = state.currentGoal.tasks.findIndex(task => task.id === action.payload.taskId);
        if (taskIndex !== -1) {
          state.currentGoal.tasks[taskIndex] = {
            ...state.currentGoal.tasks[taskIndex],
            ...action.payload.updates,
          };
        }
      }
    },
    addProgress: (state, action: PayloadAction<Omit<Progress, 'date'>>) => {
      if (state.currentGoal) {
        const newProgress = {
          ...action.payload,
          date: new Date().toISOString(),
        };
        state.currentGoal.progress.push(newProgress);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setGoal,
  addTask,
  updateTask,
  addProgress,
  setLoading,
  setError,
} = goalSlice.actions;

export default goalSlice.reducer; 