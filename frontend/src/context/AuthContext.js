import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      console.log("authcontext...");
      
      try {
        const response = await axios.get(
         `${process.env.REACT_APP_API_URL}/api/loginstatus`,
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.user) {
          setIsLoggedIn(true);
          setUser(response.data.user); 
        }
      } catch (error) {
        console.error(
          "Not logged in:",
          error.response ? error.response.data.message : "Error occurred"
        );
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLoginStatus();
}, [isLoggedIn])

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setIsLoggedIn, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
