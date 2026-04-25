// Environment configuration
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'https://sonu-crm.onrender.com/api'),
  },
  app: {
    environment: import.meta.env.VITE_NODE_ENV || 'development',
  },
} as const;

// Type for the config object
export type Config = typeof config;

// Helper function to get API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.api.baseUrl}${endpoint}`;
};
