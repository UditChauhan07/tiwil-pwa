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
    
    window.location.href="/signin"; // Redirect to sign-in page
    
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
      <nav className="navbar navbar-light bg-white  d-md-none">
        <div className="container-fluid" style={{padding:'0px'}}>
          {/* Logo */}
          <Link to="/home" className="navbar-brand">
            <img     src={`${process.env.PUBLIC_URL}/img/logomain.svg`} alt="Logo" style={{ width: "60px", height:'30px'}} />
          </Link>
<div >     
    {/* Hamburger Toggle Button */}
    <div className="d-flex">
    
                <div style={{padding:'5px',paddingRight:'0px'}} onClick={handnotify}>
                <svg width="30" height="30" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.4746 12.4615V7.84615C14.4746 5.01231 12.9787 2.64 10.37 2.01231V1.38462C10.37 0.618462 9.7498 0 8.99274 0C8.23569 0 7.63369 0.618462 7.63369 1.38462V2.01231C5.01591 2.64 3.52916 5.00308 3.52916 7.84615V12.4615L2.34341 13.6523C1.76877 14.2338 2.17011 15.2308 2.98189 15.2308H14.9945C15.8063 15.2308 16.2167 14.2338 15.6421 13.6523L14.4746 12.4615ZM8.99274 18C9.99607 18 10.817 17.1692 10.817 16.1538H7.16851C7.16851 17.1692 7.98029 18 8.99274 18ZM4.23149 2.05846C4.61458 1.70769 4.6237 1.10769 4.25886 0.738461C3.91225 0.387692 3.34674 0.378462 2.99101 0.72C1.43129 2.16 0.354994 4.11692 0.00838901 6.31385C-0.0737015 6.87692 0.354994 7.38462 0.920506 7.38462C1.35832 7.38462 1.74141 7.06154 1.81438 6.61846C2.08802 4.82769 2.96365 3.23077 4.23149 2.05846ZM15.0218 0.72C14.657 0.378462 14.0915 0.387692 13.7449 0.738461C13.38 1.10769 13.3983 1.69846 13.7722 2.04923C15.031 3.22154 15.9157 4.81846 16.1893 6.60923C16.2532 7.05231 16.6363 7.37538 17.0832 7.37538C17.6396 7.37538 18.0774 6.86769 17.9862 6.30462C17.6396 4.11692 16.5724 2.16923 15.0218 0.72Z" fill="#EE4266"/>
</svg>
                  
                  {unreadNotificationCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "63px",
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
     
           <button className="navbar-toggler" type="button" style={{paddingRight:'0px'}}onClick={toggleMobileMenu}> 

            
          <div style={{height:'32px',width:'32px',paddingRight:'0px'}}>
  {profileImage && profileImage !== "undefined" ? (
    <img
      src={`${process.env.REACT_APP_BASE_URL}/${profileImage}`}
      
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        cursor: "pointer",
        
      }}
      onClick={handleUser}
    />
  ) : (
    // Fallback to FaUser icon if no profile image or undefined is found
    
  
     <div  onClick={handleUser}>
     <svg width="32" height="32" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.99829 0C4.03502 0 -0.00170898 4.03852 -0.00170898 9C-0.00170898 13.9615 4.03502 18 8.99829 18C13.9616 18 17.9983 13.9633 17.9983 9C17.9983 4.03673 13.9616 0 8.99829 0ZM14.6278 15.1267V15.0371C14.6278 14.2698 14.1778 13.5676 13.4799 13.2459L11.07 12.1323C10.692 11.9592 10.4468 11.5768 10.4468 11.1585V10.4861C10.4468 10.277 10.5505 10.0792 10.7237 9.95527C11.1491 9.64502 11.4883 9.30752 11.6123 9.07109C11.6887 8.92959 11.7406 8.77227 11.7608 8.6167L11.8373 8.08584C11.8416 8.0542 11.8601 7.94609 11.8821 7.80722C11.9357 7.47674 12.0078 7.02235 12.0148 6.93447C12.1545 5.0536 11.3556 4.11747 10.6604 3.66747C9.65229 3.00829 8.34965 3.00565 7.34165 3.66044C6.32652 4.31786 5.86772 5.42 5.97847 6.93441C5.98726 7.03109 6.07778 7.59184 6.14458 8.00316L6.23423 8.61752C6.25884 8.78188 6.30806 8.93482 6.38276 9.07191C6.50669 9.30834 6.84858 9.6476 7.27397 9.95609C7.44711 10.0818 7.5482 10.2804 7.5482 10.487V11.1593C7.5482 11.5777 7.30299 11.9583 6.92243 12.1331L4.51515 13.2467C3.81729 13.5666 3.36729 14.2706 3.36729 15.0379V15.1276C1.71143 13.6062 0.671792 11.422 0.671792 9.00082C0.671792 4.41127 4.40724 0.675821 8.99679 0.675821C13.5863 0.675821 17.3218 4.41127 17.3218 9.00082C17.3218 11.4241 16.282 13.6063 14.6263 15.1276L14.6278 15.1267Z" fill="#EE4266"/>
</svg>

  </div>
  
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
