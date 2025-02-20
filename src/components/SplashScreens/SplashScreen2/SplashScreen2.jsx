import React from "react";
import image2 from "../../../img/SplashScreen2img.png";
import logo from "../../../img/TiwilLOGO1.png";



const SplashScreen2 = () => (
  <>
 
  <br/>
  <div className="d-flex flex-column justify-content-center align-items-center vh-80 vw-20 text-center " style={{height:"500px"}}>
    <img src={logo} alt="logo" className="pb-1"  style={{maxHeight:"100px"}}/>
    <img
      src={image2}
      alt="Plan"
      className="img-fluid my-3"
      style={{ maxHeight:"180px" }}
    />
    <p className="fw-semibold "style={{color:"#ff3366",height:'70px'}}>
    Send invites to friends and family, making every<br/> celebration more meaningful.
    </p>
  </div>

  </>
);

export default SplashScreen2;
