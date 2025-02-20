import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap'; // Import Bootstrap's Carousel

// Assuming you have 4 components that you want to display
import SplashScreen1 from '../SplashScreen1/SplashScreen1';
import  SplashScreen2 from '../SplashScreen2/SplashScreen2';
import  SplashScreen3 from '../SplashScreen3/SplashScreen3';
import  SplashScreen4 from '../SplashScreen4/Splashscreen4';
import './Corousel.css'; // Import custom Carousel styles
const BannerCarousel = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  // Change slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % 4); // Slide every 3 seconds, 4 slides
    }, 3000); // 3000ms = 3 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  return (
    <div className="carousel-container">
      <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
        <Carousel.Item>
          <SplashScreen1 />
        </Carousel.Item>
        <Carousel.Item>
          <SplashScreen2/>
        </Carousel.Item>
        <Carousel.Item>
          <SplashScreen3 />
        </Carousel.Item>
        <Carousel.Item>
          <SplashScreen4 />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default BannerCarousel;
