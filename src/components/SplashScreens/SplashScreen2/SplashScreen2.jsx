import React from "react";
import './SplashScreen2.css'



const SplashScreen2 = () => (
  <>
 
  <br/>
  <div className="d-flex flex-column justify-content-center align-items-center vh-80 vw-20 text-center ">
  <div className="d-flex flex-column justify-content-center align-items-center" style={{width:'100%'}}>
    <img src={`${process.env.PUBLIC_URL}/img/logomain.svg`} alt="logo" className="pb-1"  style={{maxHeight:"325px",maxWidth:'400px',width:'45%'}}/></div>
    <div className="splashdiv d-flex  justify-content-center align-items-center" style={{height:"300px",width:'100%'}}>
    <img
     src={`${process.env.PUBLIC_URL}/img/SplashScreen2img.webp`}
      alt="Plan"
      className="img-fluid my-3 imagefirstsplash"
      style={{ maxHeight:"180px",width:'88%' }}
    />
    </div>
    <p className="fw-semibold "style={{color:"#ff3366",height:'88px'}}>
    Send invites to friends and family, making <br/>every celebration more meaningful.
    </p>
  </div>

<br/>
  </>
  
);

export default SplashScreen2;
