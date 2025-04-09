import React from "react";
import './SplashScreen.css'


const SplashScreen1 = () => (
  <>

     <br/>
  <div className="d-flex  vh-80 vw-60 flex-column text-center">
<div className="d-flex flex-column justify-content-center align-items-center"  style={{width:'100%'}}>
    <img  src={`${process.env.PUBLIC_URL}/img/logomain.svg`} alt="logo" className="pb-1" style={{maxHeight:"325px",maxWidth:'325px',width:'45%'}}/>
    </div>
    <div className="splashdiv d-flex  justify-content-center align-items-center" style={{height:"300px",width:'100%'}}>
    <img
   src={`${process.env.PUBLIC_URL}/img/SplashScreen1image.webp`}
      alt="Celebration"
      className="img-fluid my-3 imagefirstsplash"
      style={{ maxHeight:"180px",width:"88%" }} // Ensuring height matches other screens
    />
    </div>
    <p className="fw-semibold " style={{color:"#ff3366",height:'88px'}} >
      Add & Organize Events and Celebrate<br/> Moments, gather.
    </p>
  </div>
  <br/>
  </>
);

export default SplashScreen1;
