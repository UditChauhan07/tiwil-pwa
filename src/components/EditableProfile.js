import React, { useState } from "react";
import axios from "axios";
import styles from "../components/EditableProfile.module.css";
import { IoMdCamera } from "react-icons/io";

const EditableProfile = ({ profileData: initialProfileData, onBack, onSave }) => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // Append all profile fields to FormData
    Object.keys(profileData).forEach((key) => {
      formData.append(key, profileData[key]);
    });

    // Append profile image if a new one is selected
    if (selectedImage) {
      formData.append("profileImage", selectedImage);
    }

    try {
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
        onSave(response.data.data); // Update parent state
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Profile
        </button>
      </div>
      <div className={styles.profileSection}>
        <div className={styles.profileImageWrapper}>
          <img
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : profileData.profileImage
                ? `${process.env.REACT_APP_BASE_URL}${profileData.profileImage}`
                : `${process.env.PUBLIC_URL}/assets/profile-placeholder.png`
            }
            alt="Profile"
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
        <div className={styles.formGroup}>
          <label>Location</label>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>

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
