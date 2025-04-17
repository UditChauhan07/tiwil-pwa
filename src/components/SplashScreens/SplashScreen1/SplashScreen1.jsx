import React from "react";
import './SplashScreen.css'


const SplashScreen1 = () => (
  <>

     <br/>
  <div className="d-flex   flex-column text-center">
<div className="d-flex flex-column justify-content-center align-items-center"  style={{width:'100%'}}>
    <img  src={`${process.env.PUBLIC_URL}/img/logomain.svg`} alt="logo" className="pb-1" style={{maxHeight:"325px",maxWidth:'325px',width:'55%'}}/>
    </div>
    <div className="splashdiv d-flex  justify-content-center align-items-center" style={{height:"350px",width:'100%'}}>
    <img
   src={`${process.env.PUBLIC_URL}/img/SplashScreen1image.webp`}
      alt="Celebration"
      className="img-fluid my-3 imagefirstsplash"
      style={{width:"100%",height:'350px' }} // Ensuring height matches other screens
    />
    </div>
    <p  style={{color:"#ff3366",height:'88px',fontFamily: 'Poppins',
fontWeight: "400",
fontSize: "26px",
lineHeight: "100%",
letterSpacing:" 0%",
textAlign: 'center'
}} >
      Add & Organize Events and Celebrate<br/> Moments, gather.
    </p>
  </div>
  <br/>
  </>
);

export default SplashScreen1;
