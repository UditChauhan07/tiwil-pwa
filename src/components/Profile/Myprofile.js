import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBell, FaUserFriends, FaShieldAlt, FaSignOutAlt, FaUserSlash, FaEdit } from "react-icons/fa";
import Header from "../Header";
import Navbar from "../navbar";
import Footer from "../Footer";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Myprofile.css'





function MyProfile() {
  const [notifications, setNotifications] = useState(true);
  const [user,setUser]=useState([]);

const emailOrphone=localStorage.getItem("user.emailOrphone")
const navigate=useNavigate();
  const toggleNotifications = () => {
    setNotifications(!notifications);
  };
  const handleLogout = () => {
    localStorage.removeItem("user.emailOrphone");
    // setIsLoggedIn(false);
    navigate("/signin");
  };

  const handleDelete = async () => {
      await Swal.fire({
       
        title: `<div style="font-size: 2rem; color: #FF3366; font-weight: bold;">Dear</div>`,
        text: 'Are you sure want to close your account?',
        showCancelButton: false,
        confirmButtonText: 'Let\'s Go',
        confirmButtonColor: '#FF3366',
        customClass: {
          popup: 'swal-popup',
          title: 'swal-title',
          confirmButton: 'swal-confirm-btn',
          text: 'swal-text',
        },
        imageUrl:   `${process.env.PUBLIC_URL}/img/letsgo.png`, // Optional: Set a custom icon or use the default one
        imageWidth: 80,
        imageHeight: 80,
        imageAlt: 'Close Account ',
        padding: '2rem',
        background: '#fff',
      });
    try {
     
      await axios.delete(`http://localhost:3001/auth/deleteprofile/${localStorage.getItem("user.emailOrphone")}`);
      localStorage.removeItem("user.emailOrphone");
      // setIsLoggedIn(false);
      navigate("/signup");
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

useEffect(()=>{
  const fetchUsers=async()=>{
    try{
      const response=await axios.get('http://localhost:3001/auth/getuser/${emailOrphone}');
      setUser(response.data);
      }catch(error){
        console.error("Error during fetching user:",error);

    }
  }
})

const handleeditprofile=()=>{
  navigate(`/userprofile?email=${encodeURIComponent(emailOrphone)}`);
}

  return (
    <>
    <section className="page-controls">
    <Header/>
    <Navbar/>
    <div className="container mt-4 mainsection">
      {/* Profile Header */}
      <div className="card border-0 shadow-sm mb-3">
        <div
          className="card-header text-center position-relative"
          style={{
            backgroundColor: "#FF3366",
            color: "white",
            height: "150px",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
          }}
        >
          <div
            className="position-absolute top-50 start-50 translate-middle"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border: "4px solid white",
              overflow: "hidden",
            }}
          >
            <img
               src={`${process.env.PUBLIC_URL}/img/userimage3.jpg`} // Replace with actual profile picture
              alt="Profile"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
        <div className="card-body text-center" style={{ marginTop: "50px" }}>
          <h5 className="card-title">Vinod Kumar</h5>
          <button
            className="btn"
            style={{
              backgroundColor: "#FF3366",
              color: "white",
              borderRadius: "20px",
              padding: "5px 15px",
            }}
         onClick={handleeditprofile} >
            <FaEdit className="me-2" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Options */}
      <div className="list-group shadow-sm">
      <Link to='/familyinfo'>  <button className="list-group-item list-group-item-action d-flex align-items-center">
          <FaUserFriends className="me-3" style={{ color: "#FF3366" }} />
       <span>Family Information</span>
        </button></Link> 
        <button className="list-group-item list-group-item-action d-flex align-items-center">
          <FaShieldAlt className="me-3" style={{ color: "#FF3366" }} />
          <span>Data and Privacy</span>
        </button>
        <div className="list-group-item d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <FaBell className="me-3" style={{ color: "#FF3366" }} />
            <span>Push Notifications</span>
          
            </div>
       
<label class="toggle"><input type="checkbox" id="cb1" name="toggle"/></label>
        
</div>

        <button className="list-group-item list-group-item-action d-flex align-items-center" onClick={handleLogout}>
          <FaSignOutAlt className="me-3" style={{ color: "#FF3366" }} />
          <span>Logout</span>
        </button>
        <button className="list-group-item list-group-item-action d-flex align-items-center" onClick={handleDelete}>
          <FaUserSlash className="me-3" style={{ color: "#FF3366" }} />
          <span>Close Your Account</span>
        </button>
      </div>
    </div>
    <Footer/>
    </section>
    </>
  );
}

export default MyProfile;
