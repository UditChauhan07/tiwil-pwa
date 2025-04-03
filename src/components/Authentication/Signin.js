import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import { Spinner } from "react-bootstrap";
import "react-phone-number-input/style.css"; // Ensure you include the styles
import { genToken } from '../../firebase/firebase';
import {auth,RecaptchaVerifier, signInWithPhoneNumber } from "C:/Users/Pushp battu/Desktop/Tiwil-V2/tiwil-pwa/src/firebase/firebase.js"

const SignInForm = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: "",
  });
  const [active, setActive] = useState("signin");
  const [otpGenerated, setOtpGenerated] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const [phoneError, setPhoneError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Send OTP
  const isPhoneValid = (phone) => {
    const cleanedPhone = phone?.replace(/\D/g, ""); // remove non-digits
    return cleanedPhone?.length >= 9 && cleanedPhone?.length <= 15;
  };

  // When Sending OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    setPhoneError(""); // Clear error initially

    if (!isPhoneValid(formData.phoneNumber)) {
      setPhoneError("Phone number must be between 9 to 15 digits.");
      setIsLoading(false); // Stop loading if validation fails
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/login/send-otp`,
        { phoneNumber: formData.phoneNumber }
      );

      if (!response.data.success) {
        Swal.fire("Error", response.data.message, "error");
        return;
      }
  
      // Step 1: Initialize reCAPTCHA (invisible)
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response) => {
            console.log('✔ reCAPTCHA solved:', response);
          },
          'expired-callback': () => {
            console.warn('⚠ reCAPTCHA expired');
            Swal.fire("Warning", "reCAPTCHA expired. Please try again.", "warning");
          },
        });
      }
  
      // Step 2: Add timeout for reCAPTCHA rendering
      const timeout = 10000; // 10 seconds
      const renderRecaptcha = new Promise((resolve, reject) => {
        window.recaptchaVerifier.render().then(resolve).catch(reject);
      });
  
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject("reCAPTCHA timeout"), timeout)
      );
  
      // Step 3: Try to render reCAPTCHA
      try {
        await Promise.race([renderRecaptcha, timeoutPromise]);
        console.log("✅ reCAPTCHA rendered successfully.");
      } catch (error) {
        const msg = error === "reCAPTCHA timeout"
          ? "reCAPTCHA timed out. Please try again."
          : "Error rendering reCAPTCHA.";
        console.error("❌", msg, error);
        Swal.fire("Error", msg, "error");
        setIsLoading(false);
        return;
      }
  
      // Step 4: Request Firebase to send OTP
      const confirmation = await signInWithPhoneNumber(
        auth,
        formData.phoneNumber,
        window.recaptchaVerifier
      );
  
      // Step 5: Store confirmation result
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      Swal.fire("Success", "OTP sent successfully!", "success");
    } catch (error) {
      console.error("❌ Error sending OTP:", error);
  
      let msg = "Failed to send OTP.";
      if (error.code === "auth/invalid-phone-number") msg = "Invalid phone number.";
      if (error.code === "auth/too-many-requests") msg = "Too many requests. Try again later.";
  
      Swal.fire("Error", msg, "error");
  
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (err) {
          console.error("Error clearing reCAPTCHA:", err);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  // function openDatabase() {
  //   return new Promise((resolve, reject) => {
  //     const request = indexedDB.open("UserDataDB", 1); // Database name and version
  
  //     request.onerror = (event) => {
  //       reject("Database error: " + event.target.errorCode);
  //     };
  
  //     request.onupgradeneeded = (event) => {
  //       const db = event.target.result;
  //       if (!db.objectStoreNames.contains("users")) {
  //         db.createObjectStore("users", { keyPath: "userId" }); // Store name and key path
  //       }
  //     };
  
  //     request.onsuccess = (event) => {
  //       resolve(event.target.result);
  //     };
  //   });
  // }
  // When Verifying OTP
  const handleVerifyOTP = async () => {


    if (!confirmationResult) {
      Swal.fire("Error", "OTP session expired. Please send OTP again.", "error");
      return;
    }
    setIsLoading(true); // Start loading
    console.log("⏳ OTP verification started...");


    try {

      const result = await confirmationResult.confirm(formData.otp);
   
    
      Swal.fire("Success", "Phone verified successfully!", "success");
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/login/verify-otp`,
        {
          phoneNumber: formData.phoneNumber,
          otp: formData.otp,
        }
      );

      if (response.data.success) {
        localStorage.setItem("userId", response.data.userId);

        const userId = localStorage.getItem("userId");
        const fcmToken = await genToken();

        const FCM_response = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/save-fcm-token`,
          { userId, fcmToken }
        );
        
        console.log("reached here uppr")
        const profileImagePath = response.data.user.profileImage;
     
        localStorage.setItem("profileImage", profileImagePath);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("profileStatus", JSON.stringify(response.data.profileStatus));
        localStorage.setItem("onboardingStatus", JSON.stringify(response.data.onboardingStatus));
        console.log("reached here")
        // Store data in IndexedDB
        // const userData = {
        //   userId: response.data.userId,
        //   profileImage: profileImagePath,
        //   token: response.data.token,
        //   profileStatus: response.data.profileStatus, // Assuming profileStatus is a boolean
        //   onboardingStatus: response.data.onboardingStatus, // Assuming onboardingStatus is a boolean
        // };
        
      
console.log("here")

console.log('jai ho2')
        if (!response.data.profileStatus) {
          navigate("/profile");
        } else {
          navigate("/home");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error verifying OTP.",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false); // Stop loading after OTP verification
      console.log("🔚 OTP verification process completed.");
    }
  };
  if(isLoading) {
      return (
        <div style={{ display: "flex", justifyContent: "center",alignItems:'center', marginTop: "250px" }}>
          <Spinner animation="border" role="status" style={{ width: "7rem", height: "7rem" }} />
        </div>
      );
    }

  return (
    <section className="page-controls">
      <div className="container d-flex flex-column align-items-center justify-content-center mt-5">
        

      <div className="text-center">
          <img src={`${process.env.PUBLIC_URL}/img/logomain.svg`} alt="logo" height="150px" width="200px" />
          <h2 className="font-weight-bold mt-2 mb-0" style={{ fontSize: "48px" }}>Welcome</h2>
         <p className="text-muted">Connect with your friends today!</p>
         </div>
        {/* Loader Overlay */}
        {/* {isLoading && (
          <div className="mainloader-overlay">
            <div className="spinner-border text-primary mainloader" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )} */}

        {/* Apply blur effect to the background */}
        {isLoading && <div className="blur-background"></div>}

        <div className="d-flex justify-content-center">
          <Link to="/signin">
            <p
              onClick={() => setActive("signin")}
              style={{
                fontSize: "1rem",
                border: "1px solid rgb(218, 219, 209)",
                padding: "2px 24px 0px 30px",
                backgroundColor: active === "signin" ? "#ff3366" : "transparent",
                color: active === "signin" ? "#ffffff" : "#ff3366",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Sign in
            </p>
          </Link>

          <Link to="/signup">
            <p
              onClick={() => setActive("signup")}
              style={{
                fontSize: "1rem",
                border: "1px solid rgb(202, 198, 198)",
                padding: "2px 24px 0px 30px",
                backgroundColor: active === "signup" ? "#ddd" : "transparent",
                fontWeight: active === "signup" ? "bold" : "600",
                cursor: "pointer",
                color: '#ff3366'
              }}
            >
              Sign up
            </p>
          </Link>
        </div>

        <div
          className="w-100 p-4 rounded shadow-sm"
          style={{ maxWidth: "400px", backgroundColor: "#fff" }}
        >
          {!isOtpSent ? (
            <form onSubmit={handleSendOTP}>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                  value={formData.phoneNumber}
                  onChange={(value) => {
                    const digits = value?.replace(/\D/g, "") || "";

                    // Limit to 15 digits
                    if (digits.length <= 15) {
                      setFormData({ ...formData, phoneNumber: value });
                      setPhoneError(""); // Clear error on valid change
                    } else {
                      // Show SweetAlert if more than 15 digits are entered
                      Swal.fire({
                        icon: "error",
                        title: "Phone number limit reached",
                        text: "Phone number cannot exceed 15 digits.",
                        timer: 3000,
                        showConfirmButton: false,
                      });

                      // Prevent further input if more than 15 digits are entered
                      const limitedValue = value.slice(0, 15); // Limit to 15 digits
                      setFormData({ ...formData, phoneNumber: limitedValue });
                      setPhoneError("Phone number cannot exceed 15 digits.");
                    }
                  }}
                  placeholder="Enter phone number"
                  required
                  style={{ display: 'flex', outline: "none" }}
                />
                {phoneError && <div className="invalid-feedback d-block">{phoneError}</div>}
              </div>
              <button
                type="submit"
                className="btn btn-danger w-100 py-2 mb-3"
                disabled={isLoading} // Disable button when loading
              >
                {isLoading ? (
                  <span>
                    <i className="fas fa-spinner fa-spin"></i> Sending...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          ) : (
            <div>
              <div className="mb-3">
                <label htmlFor="otp" className="form-label">
                  OTP
                </label>
                <input
                  type="text"
                  className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={(e) => {
                    const otpValue = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                    if (otpValue.length <= 6) {
                      setFormData({ ...formData, otp: otpValue });
                    }
                  }}
                  placeholder="Enter OTP"
                  required
                  maxLength="6" // Limit input to 6 characters
                />
              </div>
              <button
                className="btn btn-primary w-100 py-2 mb-3"
                style={{ background: "#ff3366" }}
                onClick={handleVerifyOTP}
                disabled={isLoading} // Disable button when loading
              >
                {isLoading ? (
                  <span>
                    <i className="fas fa-spinner fa-spin"></i> Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          )}
          <p className="text-muted mt-3">
            New on TIWIL?{" "}
            <Link
              to="/signup"
              className="text-primary fw-semibold text-decoration-none"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignInForm;
