import { Goal, Task, Progress } from '../types';
import { GROQ_CONFIG } from '../config/groq';

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Add function to list available models
export const listAvailableModels = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${GROQ_CONFIG.BASE_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${GROQ_CONFIG.API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Available Groq models:', data);
    return data.data.map((model: any) => model.id);
  } catch (error) {
    console.error('Error fetching available models:', error);
    return [];
  }
};

const callGroqAPI = async (prompt: string): Promise<string> => {
  if (!GROQ_CONFIG.API_KEY) {
    throw new Error('Groq API key is missing. Please check your .env file.');
  }

  console.log('Calling Groq API with prompt:', prompt);

  try {
    const response = await fetch(`${GROQ_CONFIG.BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_CONFIG.API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_CONFIG.MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: GROQ_CONFIG.TEMPERATURE,
        max_tokens: GROQ_CONFIG.MAX_TOKENS,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`Groq API error: ${response.statusText} - ${errorText}`);
    }

    const data: GroqResponse = await response.json();
    console.log('Groq API response:', data);
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
};

export const aiService = {
  async testConnection(): Promise<boolean> {
    try {
      const prompt = 'Hello, this is a test message. Please respond with "Connection successful"';
      const response = await callGroqAPI(prompt);
      console.log('Groq API test response:', response);
      return response.includes('Connection successful');
    } catch (error) {
      console.error('Groq API test failed:', error);
      return false;
    }
  },

  async getMotivationalMessage(goal: Goal): Promise<string> {
    const prompt = `Generate a motivational message for someone working on this goal: "${goal.goal}". 
    Their motivation is: "${goal.motivation}". 
    Make it inspiring but realistic, and reference their specific goal and motivation.`;
    
    return callGroqAPI(prompt);
  },

  async getTaskSuggestions(goal: Goal, currentTasks: Task[]): Promise<Task[]> {
    const prompt = `Given this goal: "${goal.goal}" and these current tasks: ${JSON.stringify(currentTasks)}, 
    suggest 2-3 new specific, actionable tasks that would help make progress. 
    Format the response as a JSON array of tasks with id, description, completed, and deleted fields.`;
    
    const response = await callGroqAPI(prompt);
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Error parsing task suggestions:', error);
      return [];
    }
  },

  async analyzeProgress(goal: Goal, progress: Progress[]): Promise<string> {
    const prompt = `Analyze this goal progress:
    Goal: "${goal.goal}"
    Tasks: ${JSON.stringify(goal.tasks)}
    Progress entries: ${JSON.stringify(progress)}
    
    Provide a detailed analysis of the progress, including:
    1. Completion rate and patterns
    2. Areas of strength
    3. Potential areas for improvement
    4. Specific recommendations for moving forward`;
    
    return callGroqAPI(prompt);
  },

  async getPersonalizedNudge(goal: Goal, progress: Progress[]): Promise<string> {
    const lastProgress = progress[progress.length - 1];
    const prompt = `Generate a personalized encouragement message based on:
    Goal: "${goal.goal}"
    Recent progress: ${JSON.stringify(lastProgress)}
    Overall progress: ${JSON.stringify(progress)}
    
    Make it empathetic and tailored to their current state, while keeping it motivating.`;
    
    return callGroqAPI(prompt);
  },

  async getGoalRefinement(goal: Goal): Promise<string> {
    const prompt = `Review this goal and provide specific suggestions for improvement:
    Goal: "${goal.goal}"
    Motivation: "${goal.motivation}"
    
    Consider:
    1. Is it SMART (Specific, Measurable, Achievable, Relevant, Time-bound)?
    2. Are there potential obstacles not considered?
    3. Could it be broken down differently?
    4. Are there alternative approaches worth considering?`;
    
    return callGroqAPI(prompt);
  }
}; 