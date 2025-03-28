import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSearch, FaBell, FaUser } from "react-icons/fa";
import "./navbar.css";
import axios from "axios";


const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [notifications, setNotification] = useState([]);
  const navigate = useNavigate();
  const profileImage = localStorage.getItem("profileImage");


  useEffect(() => {
    // Function to fetch notifications from the API
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/notification`, // Your API endpoint
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Update notifications and count
     
        setNotification(Array.isArray(data.notifications) ? data.notifications : []); // Update notification count
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch notifications on initial load
    fetchNotifications();

    // Set polling to fetch notifications every 10 seconds
    const intervalId = setInterval(fetchNotifications, 10000); // Poll every 10 seconds

    // Clean up the interval when component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);


  
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
    localStorage.clear();
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
const handleUser=()=>{
  navigate('/userdetail')
}
const unreadNotificationCount = Array.isArray(notifications) 
    ? notifications.filter(notif => notif.status !== "read").length 
    : 0;




    const handnotify=()=>{
      navigate('/notifications')
    }
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
            <img     src={`${process.env.PUBLIC_URL}/img/logomain.svg`} alt="Logo" style={{ width: "60px", height:'30px'}} />
          </Link>
<div >     
    {/* Hamburger Toggle Button */}
    <div className="d-flex">
    
                <div style={{padding:'5px'}} onClick={handnotify}>
                  <img
                    src={`${process.env.PUBLIC_URL}/img/notification.svg`}
                    alt="notification"
                    style={{
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                      marginTop: "5px",
                    }}
                  />
                  {unreadNotificationCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "73px",
                        backgroundColor: "#EE4266",
                        color: "white",
                        borderRadius: "50%",
                        padding: "1px 7px",
                        fontSize: "12px",
                      }}
                    >
                      {unreadNotificationCount}
                    </span>
                  )}
                </div>
     
          <button className="navbar-toggler" type="button" onClick={toggleMobileMenu}>
          
            
          <div>
  {profileImage && profileImage !== "undefined" ? (
    <img
      src={`${process.env.REACT_APP_BASE_URL}/${profileImage}`}
      
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        cursor: "pointer",
        border: '2px solid #ff3366 ',
      }}
      onClick={handleUser}
    />
  ) : (
    // Fallback to FaUser icon if no profile image or undefined is found
    <FaUser
      style={{
        fontSize: "1.5rem",
        color: "#FF3366",
        cursor: "pointer",
      }}
      onClick={handleUser}
    />
  )}
</div>
          </button>

          </div>
        
          {/* <div className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`} id="navbarNav">
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

              
              <li className="nav-item">
                <Link className="nav-link" to="/notifications">
                  Notification
                </Link>
              </li>

              {isLoggedIn ? (
                <>
             
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
          </div> */}
        </div>
        </div>
      </nav>

    </>
  );
};

export default Navbar;
