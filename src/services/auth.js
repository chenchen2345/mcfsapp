export const loginUser = async (username, password) => {
  // Validate input
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
  
  // Simulate a successful login by creating a dummy user object.
  // Note: Here we simply generate a local token and use the provided username.
  // The LLM API will use a key (from an env variable) and does not require user input.
  const userData = { username, token: 'local-auth-token' };
  localStorage.setItem('user', JSON.stringify(userData));
  return userData;
};

export const logoutUser = () => {
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return localStorage.getItem('user') !== null;
};