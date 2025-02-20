import React from "react";
import image3 from "../../../img/SplashScreen3.png"; // Ensure correct image path
import logo from "../../../img/TiwilLOGO1.png";


const SplashScreen3 = () => (
  <>

  <br/>
  <div className="d-flex flex-column justify-content-center align-items-center vh-80 vw-20 text-center">
    <img src={logo} alt="logo" className="pb-1" style={{maxHeight:"100px"}} />
    <img
      src={image3}
      alt="Enjoy"
      className="img-fluid my-3"
      style={{ maxHeight:"180px" }}
    />
    <p className="fw-semibold " style={{color:"#ff3366" ,height:'70px'}}>
    Create wishlists, view friends' wishes, and <br/>mark gifts for purchase.
    </p>
  </div>

  </>
);

export default SplashScreen3;
