import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { FiBell, FiLogOut } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";
import { IoMdLock, IoMdCloseCircleOutline } from "react-icons/io";
import styles from "../components/Account.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditableProfile from "../components/EditableProfile";
import Footer from "../components/Footer";

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    location: "",
    maritalStatus: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/guests/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setProfileData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCloseAccount = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullname");
    setIsConfirming(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullname");
    localStorage.clear();
    navigate("/signin");
    window.dispatchEvent(new Event("storage"));
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        alert("Account deleted successfully");
        navigate("/signin");
      } else {
        alert("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleYes = () => {
    deleteAccount();
    setIsConfirming(false);
  };

  const handleNo = () => {
    setIsConfirming(false);
  };
  const handleFamilyInfo = ()=> {
    navigate("/familyInfo")
  }

  return (
    <div>
      <Navbar />
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
          <h3>Are you sure you want to close your account?</h3>
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
            <img
              src={
                profileData.profileImage
                  ? `${process.env.REACT_APP_BASE_URL}${profileData.profileImage}`
                  : `${process.env.PUBLIC_URL}/assets/ProfilDefaulticon.png`
              }
              alt="Profile"
              className={styles.profileImage}
            />
            <h2 className={styles.profileName}>{profileData.fullName}</h2>
            <button className={styles.editButton} onClick={handleEditProfile}>
              Edit Profile
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
            <div className={styles.menuItem} onClick={handleLogout}>
              <FiLogOut className={styles.menuIcon} />
              <span className={styles.menuText}>Logout</span>
            </div>
            <div className={styles.menuItem} onClick={handleCloseAccount}>
              <IoMdCloseCircleOutline className={styles.menuIcon} />
              <span className={styles.menuText}>Close Account</span>
            </div>
          </div>
        </div>
      )}
    <Footer/>
    </div>
  );
};

export default Account;
