export const validateLogin = (username, password) => {
  const errors = {};
  
  if (!username) {
    errors.username = "Username is required";
  } else if (username.length < 3) {
    errors.username = "Username must be at least 3 characters long";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateEmail = (email) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Email is not valid";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};