import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSearch, FaBell, FaUser } from "react-icons/fa";
import "./navbar.css";
import axios from "axios";


const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("token");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user.emailOrphone");
    localStorage.removeItem("user.id");
    setIsLoggedIn(false);
    navigate("/signin");
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/auth/deleteprofile/${localStorage.getItem("user.emailOrphone")}`);
      localStorage.removeItem("user.emailOrphone");
      localStorage.removeItem("user.id");
      setIsLoggedIn(false);
      navigate("/signup");
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

  return (
    <>
      <div className="mainClass1" style={{ backgroundColor: "#e3e3e3" }}>
        {/* This part is always visible */}
        <div className="navAttach">
          <Link to="/home">Home</Link>
        </div>
        <div className="navAttach">
          <Link to="/events">Event</Link>
        </div>
        <div className="navAttach">
          <Link to="/invitation">Invitation</Link>
        </div>
        <div className="navAttach">
          <Link to="/home">Message</Link>
        </div>
        <div className="navAttach">
          <Link to="/home">History</Link>
        </div>
      </div>

      {/* Navbar for mobile */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm d-md-none">
        <div className="container-fluid">
          {/* Logo */}
          <Link to="/home" className="navbar-brand">
            <img     src={`${process.env.PUBLIC_URL}/img/TiwilLOGO1.png`} alt="Logo" style={{ width: "50px" }} />
          </Link>
<div >     
    {/* Hamburger Toggle Button */}
    <div className="d-flex">
    <Link to="/notifications">
  <img 
    src={`${process.env.PUBLIC_URL}/img/notification.svg`} 
    alt="notification" 
    style={{ width: "25px", height: "25px", cursor: "pointer" ,marginTop:'5px'}} // Optional styling
  />
</Link>
          <button className="navbar-toggler" type="button" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <FaTimes style={{ fontSize: "1.5rem", color: "#FF3366" }} />
            ) : (
              <FaUser style={{ fontSize: "1.5rem", color: "#FF3366" }} />
            )}
          </button>

          </div>
          {/* Collapsed Menu */}
          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav ms-auto text-center navlist">
              <li className="nav-item">
                <Link className="nav-link" to="/home">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/events">
                  Events
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/invitation">
                  Invitation
                </Link>
              </li>

              {/* Notifications and User Options (Mobile Only) */}
              <li className="nav-item">
                <Link className="nav-link" to="/notifications">
                  Notification
                </Link>
              </li>

              {isLoggedIn ? (
                <>
                  {/* Mobile View for Logged-In User */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/userdetail">
                      <FaUser className="me-2" />
                      User Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link  d-flex w-100" onClick={handleDelete}>
                      Close Account
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link d-flex w-100" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {/* Mobile View for Not Logged-In User */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        </div>
      </nav>

    </>
  );
};

export default Navbar;
