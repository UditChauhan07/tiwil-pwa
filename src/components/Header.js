import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBell, FaUser, FaBars, FaTimes } from "react-icons/fa";
import logo from "../img/TiwilLOGO1.png";
import './Hedaer.css'
import { useNavigate } from "react-router-dom";
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
const navigate=useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("user.emailOrphone");
    console.log(user)
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleuser=()=>{
    navigate('/userdetail');
  }
  const handlenotificatin=()=>{
    navigate('/notifications')
  }
  return (
    <div className="container bg-white  Headers">
      <div className="row align-items-center header22 ">
        {/* Logo Section */}
        <div className=" d-flex justify-content-between p-0">
          <img src={logo} alt="logo" style={{ width: "130px" }} />
          
       
        <div className="SearLast">
          <div className="d-none d-md-flex searchbarw">
            <input
              type="text"
              placeholder="Search"
              className=""
              style={{ width: "100%" }}
            />
            <FaSearch className="me-3 text-muted" style={{ fontSize: "1.5rem", fill: "#FF3366",}} />
          </div>

        {/* Desktop Icons */}  <Link to='/notifications' onClick={handlenotificatin}> <FaBell className="me-3 text-muted" style={{ fontSize: "1.5rem", fill: "#FF3366" }} /></Link>
        <div className=" d-none d-md-flex justify-content- align-items-center">
       
          {isLoggedIn ? (
            <Link to='/userdetail'>
              <FaUser className="me-3 text-muted" style={{ fontSize: "1.5rem", fill: "#FF3366" }} />
            </Link>
          ) : (
            <>
              <Link to="/signin" className="text-decoration-none me-3">
                <span style={{ color: "#FF3366", fontWeight: "500", fontSize: "1rem" }}>SignIn</span>
              </Link>
              <Link to="/signup" className="text-decoration-none me-3">
                <span style={{ color: "#FF3366", fontWeight: "500", fontSize: "1rem" }}>SignUp</span>
              </Link>
            </>
          )}
        </div>
        </div>
        </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="col-6 d-md-none text-end">
          <button className="btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <FaTimes style={{ fontSize: "1.5rem", fill: "#FF3366" }} />
            ) : (
              <FaBars style={{ fontSize: "1.5rem", fill: "#FF3366" }} />
            )}
          </button>
        </div>
      

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="d-md-none bg-light shadow-sm p-3 text-center">
          <FaBell className="me-3 text-muted" style={{ fontSize: "1.5rem", fill: "#FF3366" }} />
          {isLoggedIn ? (
            <Link  onClick={handleuser} className="d-block mt-2">
              <FaUser style={{ fontSize: "1.5rem", fill: "#FF3366" }} />
            </Link>
          ) : (
            <>
              <Link to="/signin" className="d-block mt-2 text-decoration-none">
                <span style={{ color: "#FF3366", fontWeight: "500", fontSize: "1rem" }}>SignIn</span>
              </Link>
              <Link to="/signup" className="d-block mt-2 text-decoration-none">
                <span style={{ color: "#FF3366", fontWeight: "500", fontSize: "1rem" }}>SignUp</span>
              </Link>
            </>
          )}

          
        </div>
      )}
    </div>
  );
};

export default Header;
