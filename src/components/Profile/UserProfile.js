import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import styles from "../Profile/profile.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "react-bootstrap"; // Import the Bootstrap Spinner for loader
import Compressor from 'compressorjs'; // Import Compressor.js

function Profile() {
  const navigate = useNavigate();
  const [today, setToday] = useState("");

  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const todayDate = new Date().toISOString().split("T")[0];
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
  const [errors, setErrors] = useState({}); // State to store validation errors
  const [loading, setLoading] = useState(false); // State to handle loading

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          fetch: "Failed to fetch user data.",
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const validateForm = () => {
    let newErrors = {};

    // 1st Check: Full Name
    if (!userData || typeof userData.fullName !== "string" || !userData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
      setErrors(newErrors);
      return false; // Stop further validation
    }

    // 2nd Check: Email
    if (!userData.email || !userData.email.trim()) {
      newErrors.email = "Email is required.";
      setErrors(newErrors);
      return false;
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(userData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
      setErrors(newErrors);
    }

    // 3rd Check: Gender
    if (!userData || !userData.gender) {
      newErrors.gender = "Please select your gender.";
      setErrors(newErrors);
      return false;
    }

    // 4th Check: Date of Birth
    if (!userData || !userData.dob) {
      newErrors.dob = "Please enter your Date of Birth.";
      setErrors(newErrors);
      return false;
    }

    // 5th Check: Marital Status
    if (!userData || !userData.maritalStatus) {
      newErrors.maritalStatus = "Please select your Marital Status.";
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image) {
      // Compress image using Compressor.js
      new Compressor(image, {
        quality: 0.8, // Compress to 80% quality
        success: (compressedResult) => {
          // Once the image is compressed, update the state
          setSelectedProfileImage(compressedResult);
        },
        error: (err) => {
          console.error("Compression error:", err);
        }
      });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    if (selectedProfileImage) {
      formData.append("profileImage", selectedProfileImage);
    }

    setLoading(true);
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
        localStorage.setItem("profileStatus", true);
        const profileImagePath = response.data.data.profileImage;
        localStorage.setItem("profileImage", profileImagePath);
        Swal.fire({
          text: "Profile added successfully",
          confirmButtonText: "Add family Info",
          confirmButtonColor: "#FF3366",
          imageUrl: `${process.env.PUBLIC_URL}/img/letsgo.png`,
          imageWidth: 80,
          imageHeight: 80,
          imageAlt: "Data Added",
          padding: "2rem",
          background: "#fff",
        });
        navigate("/additionalinfo");
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: response.data.message.includes("duplicate key")
            ? "The email address is already in use. Please try a different one."
            : response.data.message || "An unknown error occurred.",
        }));
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          error.response?.data?.message ||
          error.message ||
          "Error updating profile.",
        confirmButtonColor: "#FF3366",
      });
      console.error("Error updating profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "200px" }}>
          <Spinner animation="border" role="status" style={{ width: "5rem", height: "5rem" }} />
        </div>
      ) : (
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
                alt="Profile"
              />
              <label className={styles.cameraIcon}>
                <img
                  src={`${process.env.PUBLIC_URL}/img/uplodbutton.svg`}
                  height={"20px"}
                  width={"20px"}
                  alt="Upload Icon"
                />
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                value={userData.fullName}
                onChange={(e) =>
                  setUserData({ ...userData, fullName: e.target.value })
                }
              />
              {errors.fullName && (
                <span className={styles.error}>{errors.fullName}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
              {errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input type="tel" value={userData.phoneNumber} disabled />
            </div>

            <div className={styles.formGroup}>
              <label>Gender</label>
              <div className={styles.selectWrapper}>
                <select
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData({ ...userData, gender: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={styles.chevronIcon}
                />
              </div>
              {errors.gender && <span className={styles.error}>{errors.gender}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Date of Birth</label>
              <input
                type="date"
                value={userData.dob}
                min="1900-12-01"
                max={today}
                onChange={(e) =>
                  setUserData({ ...userData, dob: e.target.value })
                }
              />
              {errors.dob && <span className={styles.error}>{errors.dob}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Marital Status</label>
              <div className={styles.selectWrapper}>
                <select
                  value={userData.maritalStatus}
                  onChange={(e) =>
                    setUserData({ ...userData, maritalStatus: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="Unmarried">Unmarried</option>
                  <option value="Married">Married</option>
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={styles.chevronIcon}
                />
              </div>
              {errors.maritalStatus && (
                <span className={styles.error}>{errors.maritalStatus}</span>
              )}
            </div>

            <div className={styles.saveBtnBox}>
              <button className={styles.saveButton} onClick={handleSave}>
                <div className={styles.ssave}>
                  <span>Save</span>
                </div>
                <div className={styles.righticon}>
                  <img
                    src={`${process.env.PUBLIC_URL}/img/Arrow.svg`}
                    style={{ height: "30px" }}
                    alt="Arrow Icon"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
