import React from "react";


const SplashScreen4 = () => (
  <>
   
    <br />
    {/* Splash Screen Container */}
    <div className="d-flex flex-column justify-content-center align-items-center vw-20 text-center">
      {/* Logo */}
      <img      src={`${process.env.PUBLIC_URL}/img/logomain.svg`}alt="logo" className="pb-1" style={{maxHeight:"100px"}} />
      {/* Image */}
      <img
             src={`${process.env.PUBLIC_URL}/img/SplashScreen4.webp`}
        alt="Plan"
        className="img-fluid my-3"
        style={{ maxHeight:"180px" }}
      />
      {/* Text */}
      <p className="fw-semibold " style={{color:"#ff3366"}}>
        Join forces with friends to pool money for expensive gifts <br />
        and make someone's day even more special.
      </p>
    </div>

  </>
);

export default SplashScreen4;
