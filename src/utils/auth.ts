import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const [authState, setAuthState] = createStore<AuthState>({
  user: null,
  isAuthenticated: false,
  loading: true,
});

const [getToken, setToken] = createSignal<string | null>(null);

export const login = async (email: string, password: string) => {
  try {
    // Replace with your API endpoint
    const response = await fetch('https://viwo-admin.vercel.app/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    setAuthState({
      user: data.user,
      isAuthenticated: true,
      loading: false,
    });

    // Store token in secure cookie or localStorage
    document.cookie = `auth-token=${data.token}; path=/; secure; samesite=strict`;
    
    return { user: data.user };
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  setToken(null);
  setAuthState({
    user: null,
    isAuthenticated: false,
    loading: false,
  });
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  window.location.href = '/login';
};

export const checkAuth = async () => {
  try {
    const token = getToken();
    if (!token) {
      setAuthState({ ...authState, loading: false });
      return false;
    }

    // Replace with your API endpoint
    const response = await fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      logout();
      return false;
    }

    const data = await response.json();
    setAuthState({
      user: data.user,
      isAuthenticated: true,
      loading: false,
    });
    return true;
  } catch (error) {
    logout();
    return false;
  }
};

// Authentication middleware for Astro
export const isAuthenticated = async (request: Request) => {
  const token = request.headers.get('Cookie')?.match(/token=(.*?)(;|$)/)?.[1];
  
  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  try {
    // Replace with your API endpoint
    const response = await fetch('YOUR_API_URL/verify', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { isAuthenticated: false, user: null };
    }

    const data = await response.json();
    return { isAuthenticated: true, user: data.user };
  } catch (error) {
    return { isAuthenticated: false, user: null };
  }
};

export { authState };