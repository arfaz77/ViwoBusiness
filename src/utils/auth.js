export const login = (email, password) => {
    if (email === "user@example.com" && password === "password123") {
      localStorage.setItem("isAuthenticated", "true");
      return true;
    }
    return false;
  };
  
  export const isAuthenticated = () => {
    return localStorage.getItem("isAuthenticated") === "true";
  };
  