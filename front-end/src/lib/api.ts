// lib/api.ts
import { User } from '@/types/user';

const API_BASE_URL = 'https://dummyjson.com';

// Function to get the access token - you'll need to implement your own auth solution
// This is just a placeholder
const getAccessToken = (): string | null => {
  // In a real app, you might get this from localStorage, cookies, or a state management solution
  // For development with dummyJSON, you could hardcode a token
  return process.env.NEXT_PUBLIC_DUMMY_TOKEN || 'your-dummy-token';
};

async function fetchFromAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAccessToken();
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Get current authenticated user
export async function getCurrentUser(): Promise<User> {
  return fetchFromAPI<User>('/user/me');
}

// Get user by ID
export async function getUserById(id: number): Promise<User> {
  return fetchFromAPI<User>(`/users/${id}`);
}

// Get all users
export async function getUsers(): Promise<{ users: User[], total: number, skip: number, limit: number }> {
  return fetchFromAPI<{ users: User[], total: number, skip: number, limit: number }>('/users');
}

// Additional user-related API functions
export async function searchUsers(query: string): Promise<{ users: User[], total: number, skip: number, limit: number }> {
  return fetchFromAPI<{ users: User[], total: number, skip: number, limit: number }>(`/users/search?q=${encodeURIComponent(query)}`);
}