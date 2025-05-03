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
  localStorage.setItem("Profile",true);
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
  
        // Show SweetAlert and wait for user input
        Swal.fire({
          title: "Profile Added",
          text: "Would you like to add family info?",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#FF3366",
          cancelButtonColor: "#000",
          confirmButtonText: "Yes, Proceed!",
          cancelButtonText: "No, Thanks",
        }).then(async (result) => {
          // Navigate based on user choice
          navigate(result.isConfirmed ? "/additionalinfo" : "/home", { replace: true });

  
          // ✅ Always call family-info API regardless of confirmation
          try {
            const token = localStorage.getItem("token");
            const emptyFormData = new FormData(); // Empty FormData
  
            const familyResponse = await axios.post(
              `${process.env.REACT_APP_BASE_URL}/family-info`,
              emptyFormData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
  
            if (familyResponse.data.success) {
              console.log("✅ Family information saved successfully.");
              localStorage.setItem("onboardingStatus", true);
              // No need to navigate again — already done
            } else {
              console.error("❌ Error saving family information:", familyResponse.data.message);
            }
          } catch (err) {
            console.error("❌ Error in family-info API:", err.message);
          }
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
        <div style={{ display: "flex",position:'fixed', justifyContent: "center", marginTop: "200px",left:'0',right:'0' }}>
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
                alt="Profile" loading="lazy"   
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
              <div style={{position:'absolute',right:'15px',top:'37px',zIndex:'999'}}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.0098 12.9267V15.3248C17.0107 15.5474 16.9651 15.7678 16.8759 15.9717C16.7867 16.1757 16.6559 16.3588 16.4918 16.5093C16.3278 16.6598 16.1341 16.7744 15.9232 16.8457C15.7123 16.9171 15.4889 16.9435 15.2671 16.9235C12.8073 16.6562 10.4445 15.8157 8.36858 14.4694C6.43717 13.2421 4.79967 11.6046 3.57237 9.67323C2.22142 7.58784 1.38069 5.21355 1.1183 2.7427C1.09833 2.52165 1.1246 2.29886 1.19544 2.08852C1.26629 1.87818 1.38015 1.68489 1.52979 1.52096C1.67943 1.35704 1.86156 1.22607 2.06459 1.13639C2.26762 1.04671 2.4871 1.00029 2.70905 1.00008H5.10716C5.4951 0.996259 5.87119 1.13363 6.16533 1.3866C6.45948 1.63956 6.6516 1.99085 6.7059 2.37499C6.80711 3.14244 6.99483 3.89597 7.26545 4.62122C7.373 4.90733 7.39628 5.21828 7.33253 5.51722C7.26877 5.81615 7.12066 6.09055 6.90574 6.30789L5.89054 7.32309C7.02849 9.32434 8.6855 10.9814 10.6868 12.1193L11.702 11.1041C11.9193 10.8892 12.1937 10.7411 12.4926 10.6773C12.7916 10.6136 13.1025 10.6368 13.3886 10.7444C14.1139 11.015 14.8674 11.2027 15.6349 11.3039C16.0232 11.3587 16.3778 11.5543 16.6313 11.8535C16.8848 12.1527 17.0195 12.5346 17.0098 12.9267Z" stroke="#EE4266" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div>
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
   className={!userData.dob ? "has-placeholder custom-date" : "custom-date"}
        data-placeholder="DD-MM-YYYY"
                onfocus="(this.type='date')" onblur="(this.type='text')"
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
