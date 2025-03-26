import React, { useState } from "react";
import axios from "axios";
import styles from "../Profile/EditableProfile.module.css";
import { IoMdCamera } from "react-icons/io";
import { Card, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const EditableProfile = ({ profileData: initialProfileData, onBack, onSave }) => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [selectedImage, setSelectedImage] = useState(null);
   const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Set the selected image in the state
    }
  
    const formData = new FormData();
    const token = localStorage.getItem('token');
  
    // Append all profile fields to FormData
    Object.keys(profileData).forEach((key) => {
      formData.append(key, profileData[key]);
    });
  
    // Append profile image if a new one is selected
    if (file) {
      formData.append("profileImage", file); // Append the selected image (file) directly here
    }
  
    try {
      setLoading(true); // Show the spinner during the save process
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.data.success) {
        alert("Profile updated successfully!");
        const profileImagePath = response.data.data.profileImage;
        localStorage.setItem("profileImage", profileImagePath);
        // Call the parent function to update the state, if needed
       // You can call the `onSave` function to update the parent component's state
      } else {
        alert(response.data.message); // Display the response message if the update failed
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile."); // Show error message
    } finally {
      setLoading(false); // Hide the spinner after the request completes
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    const token=localStorage.getItem('token')

    // Append all profile fields to FormData
    Object.keys(profileData).forEach((key) => {
      formData.append(key, profileData[key]);
    });

    // Append profile image if a new one is selected
    if (selectedImage) {
      formData.append("profileImage", selectedImage);
    }

    try {
      setLoading(true); // Show the spinner during the save process
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const profileImagePath = response.data.data.profileImage;
        localStorage.setItem("profileImage", profileImagePath);
     
        onSave(response.data.data); // Call the parent function to update the state
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false); // Hide the spinner after the request completes
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "200px" }}>
        <Spinner animation="border" role="status" style={{ width: "7rem", height: "7rem" }} />
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
           <FontAwesomeIcon icon={faArrowLeft}  onClick={onBack}/>
        <button className={styles.backButton} >
           Profile
        </button>
      </div>
      <div className={styles.profileSection}>
        <div className={styles.profileImageWrapper}>
          <img
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : profileData.profileImage
                ? `${process.env.REACT_APP_BASE_URL}/${profileData.profileImage}`
                : `${process.env.PUBLIC_URL}/assets/profile-placeholder.png`
            }
           
            className={styles.profileImage}
          />
          <label className={styles.cameraIcon}>
            <IoMdCamera size={20} />
            <input type="file" style={{ display: "none" }} onChange={handleImageChange} />
          </label>
        </div>
      </div>

      <div className={styles.form}>
        {/* Full Name */}
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Change your name"
          />
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" value={profileData.email} disabled />
        </div>

        {/* Phone Number */}
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input type="tel" value={profileData.phoneNumber} disabled />
        </div>

        {/* Gender */}
        <div className={styles.formGroup}>
          <label>Gender</label>
          <select
            value={profileData.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div className={styles.formGroup}>
          <label>Date of Birth</label>
          <input
            type="date"
            value={profileData.dob}
            onChange={(e) => handleChange("dob", e.target.value)}
          />
        </div>

        {/* Location */}
     

        {/* Marital Status */}
        <div className={styles.formGroup}>
          <label>Marital Status</label>
          <select
            value={profileData.maritalStatus}
            onChange={(e) => handleChange("maritalStatus", e.target.value)}
          >
            <option value="">Select</option>
            <option value="Married">Married</option>
            <option value="Unmarried">Unmarried</option>
          </select>
        </div>
      </div>

      <div className={styles.saveButtonWrapper}>
        <button className={styles.saveButton} onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditableProfile;
