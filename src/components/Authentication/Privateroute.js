import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("UserDataDB", 1); // Database name and version
  
      request.onerror = (event) => {
        reject("Database error: " + event.target.errorCode);
      };
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "userId" }); // Store name and key path
        }
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }
  async function getTokenFromIndexedDB() {
    try {
      const db = await openDatabase(); // Assuming you have your openDatabase() function
      const transaction = db.transaction(["users"], "readonly");
      const store = transaction.objectStore("users");
      const userId = localStorage.getItem("userId"); // Assuming you have userId in localStorage
      if (!userId) {
        return null;
      }
      const request = store.get(userId);
  
      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          const user = event.target.result;
          resolve(user ? user.token : null);
        };
  
        request.onerror = (event) => {
          reject(event.target.errorCode);
        };
      });
    } catch (error) {
      console.error("IndexedDB error:", error);
      return null;
    }
  }
  useEffect(() => {
    async function checkAuth() {
      const token = await getTokenFromIndexedDB();
      setIsAuthenticated(!!token);
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;