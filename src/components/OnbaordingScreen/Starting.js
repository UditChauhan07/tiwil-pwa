import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingScreen from "../OnbaordingScreen/OnboardingScreen";
import SplashScreen1 from "../SplashScreens/SplashScreen1/SplashScreen1";
import SplashScreen2 from "../SplashScreens/SplashScreen2/SplashScreen2";
import SplashScreen3 from "../SplashScreens/SplashScreen3/SplashScreen3";
import SplashScreen4 from "../SplashScreens/SplashScreen4/Splashscreen4";
import "../OnbaordingScreen/Starting.css";

const Starting = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Hide Onboarding after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOnboarding(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const slides = [<SplashScreen1 />, <SplashScreen2 />, <SplashScreen3 />, <SplashScreen4 />];

  // Handle Next button
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/signin"); // Navigate to home after the last slide
    }
  };

  // Handle Skip button
  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="onboarding-container">
      {showOnboarding ? (
        <OnboardingScreen />
      ) : (
        <>
          <div className="slider">{slides[currentSlide]}</div>

          {/* Navigation Buttons */}
          <div className="onboarding-footer">
            <button onClick={handleNext} className="next-btn">
              {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
            </button>
            <button onClick={handleSkip} className="skip-btn">Skip</button>
          </div>

          {/* Pagination Dots */}
          <div className="pagination">
            {slides.map((_, index) => (
              <span key={index} className={index === currentSlide ? "dot active" : "dot"}></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Starting;
