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


  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");

    if (onboardingCompleted) {
      setShowOnboarding(false);
      navigate("/signin"); // Skip onboarding if already completed
    } else {
      setShowOnboarding(true); // Show onboarding if not completed
    }
  }, []);


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
  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  // Handle Skip button
  const handleSkip = () => {
    localStorage.setItem("onboardingCompleted", "true");
    navigate("/signin");
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
          <div className="mainBtnStart" onClick={handleNext}>
            <button  className="next-btn">
              {currentSlide === slides.length - 1 ? "Start" : "Next"}
            </button>
              <img  src={`${process.env.PUBLIC_URL}/img/Arrow.svg`} alt="arrow" className="image" />
</div>

            <button onClick={handleSkip} className="skip-btn">
            {currentSlide === 4 ? "Skip" : null}Skip</button>
          </div>

          {/* Pagination Dots */}
          <div className="pagination">
            {slides.map((_, index) => (
              <span key={index} className={index === currentSlide ? "dot active" : "dot"}  onClick={() => handleDotClick(index)}></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Starting;
