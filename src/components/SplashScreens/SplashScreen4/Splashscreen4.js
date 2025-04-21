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
        style={{ height:"350px",width:"100%" }} // Ensuring height matches other screens
      />
      {/* Text */}
      <p className="" style={{color:"#ff3366",
      fontFmily: 'Poppins',
fontWeight: '400',
fontSize: '26px',
lineHeight: '100%',
letterSpacing: '0%',
textAlign: 'center',
}}>
        Join forces with friends to pool money for expensive gifts 
        and make someone's day even more special.
        <br/>
      </p>
    </div>
    
<br/>
  </>
);

export default SplashScreen4;
