import React from "react";



const SplashScreen1 = () => (
  <>

     <br/>
  <div className="d-flex flex-column justify-content-center align-items-center vh-80 vw-60 text-center">

    <img  src={`${process.env.PUBLIC_URL}/img/logomain.svg`} alt="logo" className="pb-1" style={{maxHeight:"100px"}}/>
    <img
   src={`${process.env.PUBLIC_URL}/img/SplashScreen1image.webp`}
      alt="Celebration"
      className="img-fluid my-3"
      style={{ maxHeight:"180px" }} // Ensuring height matches other screens
    />
    <p className="fw-semibold " style={{color:"#ff3366",height:'70px'}} >
      Add & Organize Events and Celebrate<br/> Moments, gather.
    </p>
  </div>
  
  </>
);

export default SplashScreen1;
