import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../Home";
import OnboardingScreen from "../OnbaordingScreen/OnboardingScreen";

const Starting = () => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  // Hide onboarding screen after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  // Handle "Next" button click
 
  // Handle "Skip" button click (navigate to signin)
  
  return (
    <>
    <div className="App">
      {showSplash ? (
        <OnboardingScreen />
      ) : (
        <>
    
       <Home/>
     
     
</>
        
        
          
        
      )}
    </div>
    </>
  );
};

export default Starting;
