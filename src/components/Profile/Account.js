import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/navbar";
import { FiBell, FiLogOut } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";
import { IoMdLock, IoMdCloseCircleOutline } from "react-icons/io";
import styles from "../Profile/Account.module.css";
import axios from "axios";
import EditableProfile from "../Profile/EditableProfile";
import { FontAwesomeIcon ,icon} from "@fortawesome/react-fontawesome";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft,faGift } from '@fortawesome/free-solid-svg-icons';
import { Card, Button, Spinner } from "react-bootstrap";
import { setAuth, getAuth, clearAuth } from "../Authentication/auth";
import {useFetcher, useNavigate} from 'react-router-dom'
import Swal from "sweetalert2";

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dob: "",

    maritalStatus: "",
    profileImage: "",
  });
const profileImage=localStorage.getItem('profileImage')

  console.log("profiledta", profileData)

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/guests/${eventId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       if (response.data && response.data.data) {
  //         setUsers(response.data.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

 // Empty dependency array ensures the effect runs once when the component mounts

  const fetchProfileData = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true); // Set loading to true when fetching starts
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/user-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setProfileData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching completes
    }
  };
  useEffect(() => {
    fetchProfileData();
  }, [profileImage ]);

  useEffect(()=>{

  },[profileData])

 



  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCloseAccount = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullname");
    setIsConfirming(true);
    navigate('/signin')
  };
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your session.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff3366',
      cancelButtonColor: '#ff3366',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("fullname");
        localStorage.clear();
        clearAuth();
        navigate("/signin");
        // window.dispatchEvent(new Event("storage"));
     
      }
    });
  };
  const handleDeleteAccount = async () => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'Your account will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff3366',
      cancelButtonColor: '#ff3366',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });
  
    if (!confirmResult.isConfirmed) return;
  
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Account Deleted',
          text: 'Your account has been successfully deleted.',
          confirmButtonColor: '#ff3366',
        });
  
        localStorage.clear();
        clearAuth();
        navigate("/signin");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Failed to delete your account.',
          confirmButtonColor: '#ff3366',
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while deleting your account.',
        confirmButtonColor: '#ff3366',
      });
    }
  };
  const handleFamilyInfo = ()=> {
    navigate("/familyInfo")
  }

  const handleSurprise = () => {
    navigate("/surprise");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "200px", }}>
        {/* <Spinner animation="border" role="status" style={{ width: "5rem", height: "5rem", }} /> */}
        <div class="spinner-border text-danger custom-spinner" role="status" style={{width: '5rem', height: '5rem',color:'#ff3366'}}>
  <span class="visually-hidden">Loading...</span>
</div>
      </div>
    );
  }
  return (
    <div>
    
      {isEditing ? (
        <EditableProfile
          profileData={profileData}
          onBack={() => setIsEditing(false)}
          onSave={(updatedData) => {
            setProfileData(updatedData);
            setIsEditing(false);
          }}
        />
      ) : isConfirming ? (
        <div className={styles.confirmContainer}>
          <h3>Are you sure you want to Delete your account?</h3>
          <div className={styles.confirmButtons}>
            <button className={styles.yesButton} onClick={handleYes}>
              Yes
            </button>
            <button className={styles.noButton} onClick={handleNo}>
              No
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          {/* Profile Section */}

          <div className={styles.profileSection}>
<div className={styles.icons}>
          <FontAwesomeIcon icon={faArrowLeft}  onClick={() => navigate(-1)} style={{fontSize:'27px'}}/></div>
          <div style={{height:'60px',width:'60px' ,borderRadius:'50%',margin:'auto'}}>
            <img
              src={
                profileData.profileImage
                  ? `${process.env.REACT_APP_BASE_URL}/${profileData.profileImage}`
                  : `${process.env.PUBLIC_URL}/img/Default_pfp.svg`
              }
            
              className={styles.profileImage}
            />
            </div>
            <h2 className={styles.profileName}>{profileData.fullName}</h2>
            <button className={styles.editButton} onClick={handleEditProfile}>
          

            <FontAwesomeIcon icon={faPencilAlt}  />  Edit Profile

            </button>
          </div>

          {/* Options Section */}
          <div className={styles.menuSection}>
            <div className={styles.menuItem}>
              <MdAccountCircle className={styles.menuIcon} />
              <span className={styles.menuText} onClick={handleFamilyInfo}>Family Information</span>
            </div>
            <div className={styles.menuItem}>
              <IoMdLock className={styles.menuIcon} />
              <span className={styles.menuText}>Data and Privacy</span>
            </div>
            <div className={styles.menuItem}>
              <FiBell className={styles.menuIcon} />
              <span className={styles.menuText}>Push Notification</span>
              <label className={styles.toggleSwitch}>
                <input type="checkbox" className={styles.switchInput} />
                <span className={styles.switchSlider}></span>
              </label>
            </div>
            
        <div className={styles.menuItem} onClick={handleSurprise}>
              {/* <img src={`${process.env.PUBLIC_URL}/img/surprise-box.avif`}  alt="surprise" className={styles.menuIcon} height={'20px'} width={"20px"} /> */}
              <FontAwesomeIcon icon={faGift} style={{ color: "#ff3366", fontSize: "24px" ,marginRight:'9px' }} />

              <span className={styles.menuText}>Surprise Reveal</span>
            </div>
            <div className={styles.menuItem} onClick={handleLogout}>
              <FiLogOut className={styles.menuIcon} />
              <span className={styles.menuText}>Logout</span>
            </div>
            <div className={styles.menuItem} onClick={handleDeleteAccount}>
              <IoMdCloseCircleOutline className={styles.menuIcon} />
              <span className={styles.menuText}>Delete Account</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Account;
