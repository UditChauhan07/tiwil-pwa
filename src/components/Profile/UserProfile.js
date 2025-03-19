import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import styles from "../Profile/profile.module.css";
import axios from "axios";
import { IoMdCamera } from "react-icons/io";
import { Spinner } from "react-bootstrap"; // Import the Bootstrap Spinner for loader

function Profile() {
  const navigate = useNavigate();
  const [today, setToday] = useState('');

  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const todayDate = new Date().toISOString().split('T')[0];

    // Set the state with today's date
    setToday(todayDate);
  }, []);
  const [userData, setUserData] = useState({
    fullName: localStorage.getItem("fullName") || "",
    email: "",
    phoneNumber: localStorage.getItem("phoneNumber") || "",
    gender: "",
    dob: "",
   
    maritalStatus: "",
    profileImage: "",
  });

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // State to handle loading

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Set loading true when fetching data
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
      } finally {
        setLoading(false); // Set loading false after fetching data
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

    setLoading(true); // Set loading true while saving the data
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
          text: 'Profile added successfully',
          showCancelButton: false,
          confirmButtonText: 'Add family Info',
          confirmButtonColor: '#FF3366',
          customClass: {
            popup: 'swal-popup',
            title: 'swal-title',
            confirmButton: 'swal-confirm-btn',
            text: 'swal-text',
          },
          imageUrl: `${process.env.PUBLIC_URL}/img/letsgo.png`, // Optional: Set a custom icon or use the default one
          imageWidth: 80,
          imageHeight: 80,
          imageAlt: 'Data Added',
          padding: '2rem',
          background: '#fff',
        });
        navigate("/additionalinfo");
      } else {
        // Handle the case where the profile creation is unsuccessful
        if (response.data.message.includes("duplicate key")) {
          setErrorMessage("The email address is already in use. Please try a different one.");
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Email',
            text: 'The email address you have entered is already associated with another account. Please use a different email.',
            confirmButtonColor: '#FF3366',
          });
        } else {
          setErrorMessage(response.data.message || "An unknown error occurred.");
        }
      }
    } catch (error) {
      // Handle other errors like network issues, unexpected server responses, etc.
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || error.message || 'Error updating profile.',
        confirmButtonColor: '#FF3366',
      });
      console.error("Error updating profile:", error.message);
      setErrorMessage("Failed to update profile.");
    } finally {
      setLoading(false); // Set loading false once the operation is done
    }
  }    

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
                : `${process.env.PUBLIC_URL}/img/Default_pfp.svg`
            }
  
            className={styles.profileImage}
          />
          <label className={styles.cameraIcon}>
            <img src={`${process.env.PUBLIC_URL}/img/uplodbutton.svg`} height={"20px"} width={"20px"} />
            <input type="file" style={{ display: "none" }} onChange={handleProfileImageChange} />
          </label>
        </div>
      </div>

      {loading ? (
        <div className={styles.loaderWrapper}>
          <Spinner animation="border" variant="primary" />
          <span>Loading...</span>
        </div>
      ) : (
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
              value={userData.dob}  min="1900-12-1"  max={today} 
              onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
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

          <div className={styles.saveBtnBox} style={{ display: "flex", justifyContent: "space-between" }}>
            <button className={styles.saveButton} onClick={handleSave} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ paddingTop: '6px' }}> Save </span>
              <img src={`${process.env.PUBLIC_URL}/img/Arrow.svg`} alt="arrow" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
