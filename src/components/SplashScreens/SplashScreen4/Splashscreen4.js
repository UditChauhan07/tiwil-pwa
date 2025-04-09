import React from "react";
import './SplashScreen4.css'

const SplashScreen4 = () => (
  <>
   
    <br />
    {/* Splash Screen Container */}
    <div className="d-flex flex-column  align-items-center vw-20 text-center">
    
 
      <img      src={`${process.env.PUBLIC_URL}/img/logomain.svg`}alt="logo"  style={{maxHeight:"350px",width:'55%'}} />
     
      <img
             src={`${process.env.PUBLIC_URL}/img/SplashScreen4.webp`}
        alt="Plan"
        className="img-fluid  imagefirstsplash"
        style={{ height:"350px",width:"88%" }} // Ensuring height matches other screens
      />
      {/* Text */}
      <p className="fw-semibold " style={{color:"#ff3366",height:'92px'}}>
        Join forces with friends to pool money for expensive gifts 
        and make someone's day even more special.
      </p>
    </div>
    
<br/>
  </>
);

export default SplashScreen4;
