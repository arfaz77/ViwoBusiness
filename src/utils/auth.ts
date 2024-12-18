export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Simulated login function
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const payloadUrl = `http://localhost:3000/api/users/login`; // Replace with your Payload login endpoint

  const response = await fetch(payloadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || 'Login failed');
  }

  const data: AuthResponse = await response.json();
  localStorage.setItem('token', data.token); // Store token in localStorage
  localStorage.setItem('user', JSON.stringify(data.user)); // Optional: Store user info
  return data;
};

// Utility function to get the token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Utility function to log out
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login'; // Redirect to login page
};

// Fetch wrapper with token authorization
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();

  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      logout(); // Log out if the token is invalid
    }
    const errorData = await response.json();
    throw new Error(errorData?.message || 'Error occurred while fetching data');
  }

  return response.json();
};
