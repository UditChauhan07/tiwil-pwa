import React from "react";

import './SplashScreen3.css'

const SplashScreen3 = () => (
  <>

  <br/>
  <div className="d-flex flex-column justify-content-center align-items-center vh-80 vw-20 text-center">
    <img   src={`${process.env.PUBLIC_URL}/img/logomain.svg`} alt="logo" className="pb-1" style={{maxHeight:"100px"}} />
    <img
     src={`${process.env.PUBLIC_URL}/img/SplashScreen3.webp`}
      alt="Enjoy"
      className="img-fluid my-3 imagefirstsplash"
      style={{ maxHeight:"180px" }}
    />
    <p className="fw-semibold " style={{color:"#ff3366" ,height:'70px'}}>
    Create wishlists, view friends' wishes, and <br/>mark gifts for purchase.
    </p>
  </div>

  </>
);

export default SplashScreen3;
