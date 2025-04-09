import React from "react";

import './SplashScreen3.css'

const SplashScreen3 = () => (
  <>

  <br/>
  <div className="d-flex flex-column vw-60 vh-80  text-center ">
  <div className="d-flex flex-column justify-content-center align-items-center" style={{width:'100%'}}>
    <img   src={`${process.env.PUBLIC_URL}/img/logomain.svg`} alt="logo" className="pb-1" style={{maxHeight:"325px",width:'45%'}} />
    </div>
    <div className="splashdiv d-flex  justify-content-center align-items-center" style={{height:"300px",width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
    <img
     src={`${process.env.PUBLIC_URL}/img/SplashScreen3.webp`}
      alt="Enjoy"
      className="img-fluid my-3 imagefirstsplash"
      style={{ maxHeight:"180px",width:"88%"  }}
    /></div>
    <p className="fw-semibold " style={{color:"#ff3366" ,height:'88px'}}>
    Create wishlists, view friends' wishes, and <br/>mark gifts for purchase.
    </p>
  </div>
  <br/>

  </>
);

export default SplashScreen3;
