import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginPage.css";
import SplashScreen1 from "../components/SplashScreens/SplashScreen1/SplashScreen1";
import SplashScreen2 from "../components/SplashScreens/SplashScreen2/SplashScreen2"; 
import SplashScreen3 from "../components/SplashScreens/SplashScreen3/SplashScreen3";
import SplashScreen4 from "../components/SplashScreens/SplashScreen4/Splashscreen4"// Import your slide components
import backphone from '../img/home-phones.png'
import logo from '../img/TiwilLOGO1.png'
import { Link } from "react-router-dom";


const slides = [<SplashScreen1 />, <SplashScreen2 />, <SplashScreen3 />,<SplashScreen4/>]; // Component-based slideshow

const LoginPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      {/* Phone images (Hide on small screens) */}
      <div className="phone-container d-none d-md-block">
        <div className="back-phone" style={{marginRight:"12px"}}>
          <img src={backphone} alt="Phone Back" height={"50%"}/>
        </div>
        <div className="front-phone fade-in">{slides[currentSlide]}</div>
      </div>

      {/* Login Form */}
      <div className="login-box p-4">
       <img src={logo} alt="logo" style={{maxHeight:"100px"}} />

       <h3 className="m-2">Sign In</h3>
        <input type="text" className="form-control mt-3" placeholder="Phone number, username or email address" />
       
        <button className="btn btn-primary w-50 mt-3" style={{backgroundColor:"#ff3366"}}>SEND OTP</button>
        <div className="text-center my-3">OR</div>
      
        <div className="signup-box text-center mt-4">
          Don't have an account? <Link to='/signup' style={{color:'#ff3366'}}>Sign up</Link>
        </div>
      
      </div>
    </div>
  );
};

export default LoginPage;
