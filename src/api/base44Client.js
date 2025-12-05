import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6926abb6433a685a59acbf3e", 
  requiresAuth: true // Ensure authentication is required for all operations
});
