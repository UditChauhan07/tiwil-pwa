import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "../Profile/profile.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "react-bootstrap";

function Profile() {
  const navigate = useNavigate();
  const [today, setToday] = useState("");
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    fullName: localStorage.getItem("fullName") || "",
    email: "",
    phoneNumber: localStorage.getItem("phoneNumber") || "",
    gender: "",
    dob: "",
    maritalStatus: "",
    profileImage: "",
  });

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    setToday(todayDate);

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
        setErrors((prev) => ({
          ...prev,
          fetch: "Failed to fetch user data.",
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!userData.fullName.trim() || !/^[A-Za-z\s]{3,25}$/.test(userData.fullName)) {
      newErrors.fullName = "Name must be 3-25 characters long, only letters and spaces.";
    }
    if (!userData.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(userData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!userData.gender) {
      newErrors.gender = "Please select your gender.";
    }
    if (!userData.dob) {
      newErrors.dob = "Please enter your Date of Birth.";
    }
    if (!userData.maritalStatus) {
      newErrors.maritalStatus = "Please select your Marital Status.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedProfileImage(file);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value);
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
        localStorage.setItem("profileImage", response.data.data.profileImage);

        Swal.fire({
          title: "Profile Added",
          text: "Would you like to add family info?",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#FF3366",
          cancelButtonColor: "#000",
          confirmButtonText: "Yes, Proceed!",
          cancelButtonText: "No, Thanks",
        }).then((result) => {
          navigate(result.isConfirmed ? "/additionalinfo" : "/home");
        });
      } else {
        setErrors({
          email: response.data.message.includes("duplicate key")
            ? "This email is already in use."
            : response.data.message || "An error occurred.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Error updating profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "200px" }}>
          {/* <Spinner animation="border" role="status" style={{ width: "5rem", height: "5rem" }} /> */}
          <div class="spinner-border text-danger custom-spinner" role="status" style={{width: '5rem', height: '5rem',color:'#ff3366'}}>
  <span class="visually-hidden">Loading...</span>
</div>
        </div>
      ) : (
        <div className={styles.container}>
          <h2>Profile Setup</h2>

          

          <div className={styles.form}>
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
                {/* <img
                  src={`${process.env.PUBLIC_URL}/img/uplodbutton.svg`}
                  height={"20px"}
                  width={"20px"}
                  alt="Upload"
                /> */}
                <input type="file" style={{ display: "none" }} onChange={handleImageChange} />
                Edit
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                value={userData.fullName}
                onChange={(e) => {
    const value = e.target.value;
    setUserData({ ...userData, fullName: value });

    // Clear error if value becomes valid
    if (/^[A-Za-z\s]{3,25}$/.test(value)) {
      setErrors((prev) => ({ ...prev, fullName: "" }));
    }
  }}
              />
              {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
            </div>
          </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={userData.email}
                placeholder="tiwil@gmail.com"
                onChange={(e) => {
    const value = e.target.value;
    setUserData({ ...userData, email: value });

    if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value)) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  }}
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.phoneIcon}`}>
              <label>Phone Number</label>
              <input className={styles.inputphone} type="tel" value={userData.phoneNumber} disabled />
              <img src="img/PhoneIcon.svg" alt="Phone"  />
            </div>

            <div className={styles.formGroup}>
              <label>Gender</label>
              <div className={styles.selectWrapper}>
                <select
                  value={userData.gender}
                  onChange={(e) => {
    setUserData({ ...userData, gender: e.target.value });
    if (e.target.value) {
      setErrors((prev) => ({ ...prev, gender: "" }));
    }
  }}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className={styles.chevronIcon} />
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
                onChange={(e) => {
    setUserData({ ...userData, dob: e.target.value });
    if (e.target.value) {
      setErrors((prev) => ({ ...prev, dob: "" }));
    }
  }}
              />
              {errors.dob && <span className={styles.error}>{errors.dob}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Marital Status</label>
              <div className={styles.selectWrapper}>
                <select
                  value={userData.maritalStatus}
                  onChange={(e) => {
    setUserData({ ...userData, maritalStatus: e.target.value });
    if (e.target.value) {
      setErrors((prev) => ({ ...prev, maritalStatus: "" }));
    }
  }}
                >
                  <option value="">Select</option>
                  <option value="Unmarried">Unmarried</option>
                  <option value="Married">Married</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className={styles.chevronIcon} />
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
                    alt="Arrow"
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
