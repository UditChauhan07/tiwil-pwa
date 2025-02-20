import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import styles from  "../Profile/profile.module.css"
import axios from "axios";
import { IoMdCamera } from "react-icons/io";
import arrow from '../../img/Arrow.svg'
import logo from '../../img/letsgo.png'

function Profile() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    fullName: localStorage.getItem("fullName") || "",
    email: "",
    phoneNumber: localStorage.getItem("phoneNumber") || "",
    gender: "",
    dob: "",
    location: "",
    maritalStatus: "",
    profileImage: "",
  });

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setUserData(response.data.data);
         
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProfileImage(file);
    }
  };

  const handleSave = async () => {
    setErrorMessage(""); // Reset error message before validation

    if (!userData.fullName.trim()) {
      setErrorMessage("Full Name is required.");
      return;
    }

    if (!userData.dob) {
      setErrorMessage("Please enter your Date of Birth.");
      return;
    }

    if (!userData.location.trim()) {
      setErrorMessage("Please enter your Location.");
      return;
    }

    if (!userData.gender) {
      setErrorMessage("Please select your gender.");
      return;
    }

    if (!userData.maritalStatus) {
      setErrorMessage("Please select your Marital Status.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    if (selectedProfileImage) {
      formData.append("profileImage", selectedProfileImage);
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        localStorage.setItem("profileStatus", true);
        Swal.fire({
          
          text: 'Profile added successfully ',
          showCancelButton: false,
          confirmButtonText: 'Add family Info',
          confirmButtonColor: '#FF3366',
          customClass: {
            popup: 'swal-popup',
            title: 'swal-title',
            confirmButton: 'swal-confirm-btn',
            text: 'swal-text',
          },
          imageUrl: logo, // Optional: Set a custom icon or use the default one
          imageWidth: 80,
          imageHeight: 80,
          imageAlt: 'Data Added',
          padding: '2rem',
          background: '#fff',
        });
        navigate("/additionalinfo");
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Profile Setup</h2>

      <div className={styles.profileSection}>
        <div className={styles.profileImageWrapper}>
          <img
            src={
              selectedProfileImage
                ? URL.createObjectURL(selectedProfileImage)
                : userData.profileImage
                ? `${process.env.REACT_APP_BASE_URL}${userData.profileImage}`
                : `${process.env.PUBLIC_URL}/assets/ProfilDefaulticon.png`
            }
            alt="Profile"
            className={styles.profileImage}
          />
          <label className={styles.cameraIcon}>
            <IoMdCamera size={20} />
            <input type="file" style={{ display: "none" }} onChange={handleProfileImageChange} />
          </label>
        </div>
      </div>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            value={userData.fullName}
            onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input type="tel" value={userData.phoneNumber} disabled />
        </div>

        <div className={styles.formGroup}>
          <label>Gender</label>
          <select
            value={userData.gender}
            onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Date of Birth</label>
          <input
            type="date"
            value={userData.dob}
            onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Location</label>
          <input
            type="text"
            value={userData.location}
            onChange={(e) => setUserData({ ...userData, location: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Marital Status</label>
          <select
            value={userData.maritalStatus}
            onChange={(e) => setUserData({ ...userData, maritalStatus: e.target.value })}
          >
            <option value="">Select</option>
            <option value="Unmarried">Unmarried</option>
            <option value="Married">Married</option>
          </select>
        </div>
      </div>
      <div className={styles.saveBtnBox} style={{display:"flex", justifyContent:'space-between'}}>
  <button className={styles.saveButton} onClick={handleSave} style={{display:"flex",justifyContent:"space-between"}}>
    
    Save
    <img src={arrow} alt="arrow"  />
  </button>
</div>

    </div>
  );
}

export default Profile;
