import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import { Spinner } from "react-bootstrap";
import "react-phone-number-input/style.css"; // Ensure you include the styles
import { genToken } from '../../firebase/firebase';
import {auth,RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase/firebase"
import styles from './signin.module.css'
import OtpInput from 'react-otp-input'; // Import the OtpInput component
import { setAuth, getAuth, clearAuth } from "./auth";

import {useEffect} from 'react'

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
  const [otp, setOtp] = useState("");
    const [resendCooldown, setResendCooldown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [resendAttempts, setResendAttempts] = useState(0);
     const [messageIndex, setMessageIndex] = useState(0);
      const messages = [
       
        "Almost there...",
        "Securing the connection...",
        "Hang tight, verifying...",
        "Just a moment..."
      ];
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   useEffect(() => {
      let timer;
      if (isOtpSent && resendCooldown > 0) {
        timer = setTimeout(() => {
          setResendCooldown((prev) => prev - 1);
        }, 1000);
      } else if (resendCooldown === 0) {
        setCanResend(true);
      }
      return () => clearTimeout(timer);
    }, [isOtpSent, resendCooldown]);
  
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
    setCanResend(false);
    setResendCooldown(60);
    if (!isPhoneValid(formData.phoneNumber)) {
      setPhoneError("Phone number must be between 9 to 15 digits.");
      setIsLoading(false); // Stop loading if validation fails
      return;
    }
  
    try {
      // Call your backend login API
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/login/send-otp`,
        { phoneNumber: formData.phoneNumber }
      );
  
      // Handle 2xx response where API indicates logical failure (e.g., user not found but API doesn't use 404)
      if (!response.data.success) {
        // Use the message provided by your API
        Swal.fire("Login Failed", response.data.message || "This phone number is not registered.", "error");
        setIsLoading(false); // Stop loading
        return; // Exit
      }
  
      // --- Proceed with reCAPTCHA and Firebase OTP ---
  
      // Step 1: Initialize reCAPTCHA (invisible)
      if (!window.recaptchaVerifier) {
          // Ensure the container exists in your JSX: <div id="recaptcha-container"></div>
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
              size: 'invisible',
              callback: (response) => console.log('✔ reCAPTCHA solved:', response),
              'expired-callback': () => {
                console.warn('⚠ reCAPTCHA expired');
                Swal.fire("Warning", "reCAPTCHA expired. Please try again.", "warning");
              },
            });
      }
  
      // Step 2: Add timeout for reCAPTCHA rendering
      const timeout = 10000; // 10 seconds
      const renderRecaptcha = new Promise((resolve, reject) => {
          // Check if already rendered to avoid errors/redundancy
          if (window.recaptchaVerifier?.controller?.rendered) {
              resolve();
          } else {
              window.recaptchaVerifier.render().then(resolve).catch(reject);
          }
      });
  
      const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("reCAPTCHA timeout")), timeout) // Use Error object
      );
  
      // Step 3: Try to render reCAPTCHA
      try {
        await Promise.race([renderRecaptcha, timeoutPromise]);
        console.log("✅ reCAPTCHA rendered successfully or already rendered.");
      } catch (error) {
        const msg = error.message === "reCAPTCHA timeout"
          ? "reCAPTCHA verification timed out. Please check your connection and try again."
          // Improved message for other render errors
          : "Couldn't initialize verification. Please refresh the page and try again.";
        console.error("❌ Error rendering reCAPTCHA :", error);
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
      localStorage.setItem('setIsOtpSent', true); 
      setIsOtpSent(true);
      setResendCooldown(60);
      Swal.fire({
           title: "Success",
           text: "OTP sent successfully!",
           icon: "success",
           confirmButtonColor: "#ff3366" // Custom confirm button color
         });
         
  
    }catch (error) {
      console.error("❌ Error sending OTP (Login Flow):", error);
      let errorHandled = false;
    
      if (error.response) {
        if (error.response.status === 404) {
          setPhoneError("This phone number is not registered.");
          errorHandled = true;
        }
      }
    
      if (!errorHandled && error.code) {
        let msg = "Failed to send OTP.";
        if (error.code === "auth/invalid-phone-number") {
          msg = "The Phone number  is invalid.";
        } else if (error.code === "auth/too-many-requests") {
          msg = "Too many attempts. Try again later.";
        } else if (error.message.includes("reCAPTCHA")) {
          msg = "Failed reCAPTCHA check. Please refresh and try again.";
        }
        setPhoneError(msg);
        errorHandled = true;
      }
    
      if (!errorHandled) {
        setPhoneError("Unexpected error occurred. Please refresh and try again.");
      }
    
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (clearError) {
          console.error("Error clearing reCAPTCHA:", clearError);
        }
      }
    }
     finally {
      setIsLoading(false); // Ensure loading state is always reset
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
    if (!formData.otp) {
      setPhoneError({ hasError: true, message: "Please Enter OTP first" });
      return; // Don't proceed if OTP is empty
    }
  
    if (formData.otp.length !== 6) {
      setPhoneError({ hasError: true, message: "OTP must be exactly 6 digits." });
      return; // Don't proceed if OTP is not 6 digits
    }
  
    setIsLoading(true);
    console.log("⏳ OTP verification started...");
  
    try {
      const result = await confirmationResult.confirm(formData.otp);
  
     
  
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/login/verify-otp`,
        {
          phoneNumber: formData.phoneNumber,
          otp: formData.otp,
        }
      );
  
      if (response.data.success) {
        const userId = response.data.userId;
        localStorage.setItem("userId", userId);
  
        const fcmToken = localStorage.getItem("PushToken");
  
        // ✅ Conditionally call save-fcm-token if token exists
        if (fcmToken) {
          try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}/save-fcm-token`, {
              userId,
              fcmToken,
            });
            console.log("✅ FCM token saved successfully.");
          } catch (err) {
            console.error("❌ Error saving FCM token:", err);
          }
        } else {
          console.log("ℹ️ No FCM token found. Skipping FCM token save.");
        }
  console.log("jai baba ki 1st")
        // Set other localStorage items
        const profileImagePath = response.data.user.profileImage;
        localStorage.setItem("profileImage", profileImagePath);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("profileStatus", JSON.stringify(response.data.profileStatus));
        localStorage.setItem("onboardingStatus", JSON.stringify(response.data.onboardingStatus));
        const token=response.data.token;
        console.log("jai baba ki")
        console.log(token)
        setAuth(token);
        console.log("jai baba ki")
        // Navigate based on profile status
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
      console.error("❌ OTP verification error:", error);
    
      const errorMsg = error?.response?.data?.message || "Error verifying OTP.";
      setPhoneError({ hasError: true, message: errorMsg });
    }
    
    finally {
      setIsLoading(false);
      console.log("🔚 OTP verification process completed.");
    }
  };
  
 useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 1500); // change every 2 seconds
  
      return () => clearInterval(interval);
    }
  }, [isLoading]);
  
  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "50px",position:'fixed',left:'0',right:'0',bottom:'0',top:'0' }}>
        <div className="spinner-border text-danger custom-spinner" role="status" style={{ width: '5rem', height: '5rem', color: '#ff3366' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
          {messages[messageIndex]}
        </p>
      </div>
    );
  }

  return (
    <section className="page-controls py-4">
         {!isOtpSent ? (
      <div className="container d-flex flex-column align-items-center justify-content-center ">
        

      <div className="text-center ">
          <img src={`${process.env.PUBLIC_URL}/img/logomain.svg`} alt="logo" height="100px" width="200px"     />
          <h2 className="font-weight-bold mt-4 mb-0" style={{ fontSize: "48px",fontFamily: "Poppins",
fontWeight: "500",
fontSize: "48px",
lineHeight: "100%",
letterSpacing: "0%",
 }}>Welcome</h2>
         <p style={{fontFamily: "Poppins",
fontWeight: "500",
fontSize: "12px",
lineHeight: "100%",
letterSpacing: "0%",
textAlign: "center",
verticalAlign: "middle",
marginBottom:'5px'
}}>To continue, enter your phone number</p>
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

        <div className="d-flex justify-content-center mt-4" style={{padding:'4px',border:'1px solid whitesmoke',width:'100%',height:'40px',    borderRadius: '7px' }}>
          <Link to="/signin"   onClick={() => setActive("signin")}
              style={{
                width:'50%',
                display:'flex',
                justifyContent:'center',
                fontSize: "18px",
                borderRadius:'5px',
               
              
                backgroundColor: active === "signin" ? "#EE4266" : "transparent",
                color: active === "signin" ? "#ffffff" : "#EE4266",
                fontWeight: "500",
                cursor: "pointer",
              }}>
            <p
             
            >
              Sign in
            </p>
          </Link>

          <Link to="/signup"    onClick={() => setActive("signup")}
              style={{
                width:'50%',
                display:'flex',
                justifyContent:'center',
                fontSize: "18px",
              borderRadius:'5px',
         
                backgroundColor: active === "signup" ? "#EE4266" : "transparent",
                fontWeight: active === "signup" ? "bold" : "500",
                cursor: "pointer",
                color: '#ff3366'
              }}>
            <p
             
            >
              Sign up
            </p>
          </Link>
        </div>

        <div
          className="w-100  "
          style={{ maxWidth: "760px", backgroundColor: "#fff",    margin: '0 0 40px 0',padding: '1.5rem 0rem 1.5rem 0rem' }}
        >
     
            <form style={{border:'none'}} >
              <div className="mb-3 phoneBorder" style={{position:'relative'}}>
              <div style={{position:'absolute',right:'15px',top:'17px',zIndex:'999'}}><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.0098 12.9267V15.3248C17.0107 15.5474 16.9651 15.7678 16.8759 15.9717C16.7867 16.1757 16.6559 16.3588 16.4918 16.5093C16.3278 16.6598 16.1341 16.7744 15.9232 16.8457C15.7123 16.9171 15.4889 16.9435 15.2671 16.9235C12.8073 16.6562 10.4445 15.8157 8.36858 14.4694C6.43717 13.2421 4.79967 11.6046 3.57237 9.67323C2.22142 7.58784 1.38069 5.21355 1.1183 2.7427C1.09833 2.52165 1.1246 2.29886 1.19544 2.08852C1.26629 1.87818 1.38015 1.68489 1.52979 1.52096C1.67943 1.35704 1.86156 1.22607 2.06459 1.13639C2.26762 1.04671 2.4871 1.00029 2.70905 1.00008H5.10716C5.4951 0.996259 5.87119 1.13363 6.16533 1.3866C6.45948 1.63956 6.6516 1.99085 6.7059 2.37499C6.80711 3.14244 6.99483 3.89597 7.26545 4.62122C7.373 4.90733 7.39628 5.21828 7.33253 5.51722C7.26877 5.81615 7.12066 6.09055 6.90574 6.30789L5.89054 7.32309C7.02849 9.32434 8.6855 10.9814 10.6868 12.1193L11.702 11.1041C11.9193 10.8892 12.1937 10.7411 12.4926 10.6773C12.7916 10.6136 13.1025 10.6368 13.3886 10.7444C14.1139 11.015 14.8674 11.2027 15.6349 11.3039C16.0232 11.3587 16.3778 11.5543 16.6313 11.8535C16.8848 12.1527 17.0195 12.5346 17.0098 12.9267Z" stroke="#EE4266" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div>
                <label htmlFor="phone" className="form-label" >Phone Number</label>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  className={`form-contrl ${phoneError ? 'is-invalid' : ''}`}
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
                  style={{ display: 'flex', outline: "none",border:'none' }}
                />
                {phoneError && <div className="invalid-feedback d-block " style={{textAlign:'left'}}>{phoneError}</div>}
              </div>
              </form>
              <div className='Submit-button' style={{position:'fixed', bottom:'10px' ,width: '100%', margin: 'auto',left: '0',    padding: '0 20px' ,backgroundColor:'#fff' }}>
              <button
                type="submit"
                className="btn  w-100 " style={{backgroundColor:'#EE4266',borderRadius:'15px',color:'#fff',fontSize:'16px',fontWeight:'600',height:'50px'}}
                disabled={isLoading} // Disable button when loading
             onClick={handleSendOTP} >
                {isLoading ? (
                  <span>
                    <i className="fas fa-spinner fa-spin"></i> Sending...
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
        

          <p className="text-muted mt-3 d-flex justify-content-center" >
            <u>New on TIWIL?{" "}</u>&nbsp;
          <u> <Link
              to="/signup"
              className="text-primary fw-semibold text-decoration-none"
            >
                 Create an account
            </Link>
            </u> 
          </p>
          </div>
        </div>
      </div>
    ) : (
            <div>
            <div style={{ display: "flex", justifyContent: "center",alignItems:'center', marginTop: "20px",height:'80%x',width:'100%',marginBottom:'20px' }}>
              <img src={`${process.env.PUBLIC_URL}/img/Otps.webp`} alt="logo" height="60%" width="60%"  loading="lazy"   />
            </div>
              <div className="mb-3">
                <label htmlFor="otp" className="form-label" style={{fontSize:'20px',fontWeight:'600',color:'black' ,display:'flex',justifyContent:'center',alignItems:'center',marginTop:'85px',marginBottom:'30px'}}>
                  Please Enter Otp
                </label>
                {/* <input
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
                 {phoneError.hasError && <div className="invalid-feedback d-block">{phoneError.message}</div>}
                  */}
                  <div className="d-flex justify-content-center align-items-center w-70" >
                  <OtpInput
  className={`${styles.inputotp} form-control ${phoneError ? 'is-invalid' : ''}`}
  id="otp"
  name="otp"
  type="number"
  value={formData.otp}
  onChange={(otpValue) => {
    const cleanedOtp = otpValue.replace(/\D/g, "");
    setPhoneError("")
    if (cleanedOtp.length <= 6) {
      setFormData({ ...formData, otp: cleanedOtp });
    }
  }}
  numInputs={6}
 
  renderInput={(props) => <input {...props} type="tel" />}

  inputStyle={{
    width: '40px',
    height: '40px',
    margin: '0 6px',
    fontSize: '20px',
    fontWeight:'600',
    borderRadius: '10px',
    border: '1px solid none',
    color: 'black',
    border:'none',
    boxShadow: "0px 0px 2px 0px #00000040 inset",
    background:'#F2F2F2',
    textAlign: 'center',
    outline:'none'
  }}
/>
 </div> {phoneError.hasError && <div className="invalid-feedback d-block " style={{textAlign:'center'}}>{phoneError.message}</div>}
              
              </div>
              
              <br/>
              
              
              {canResend ? (
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button
                type="button"
                onClick={handleSendOTP}
                className="btn  "
                style={{
                  fontWeight: "600",
                  color: "#EE4266",
                }}
              >
              <span style={{color:'black',fontWeight:'500px',textDecoration:'unset',fontWeight:'500',fontSize:'14px'}}>Didn't get code?</span> &nbsp;Resend OTP
              </button>
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: "1px" }}>
              <span className="text-muted"> 
                Resend OTP in {resendCooldown}
              </span>
            </div>
          )}

              <div className="d-flex justify-content-center align-items-center " style={{marginTop:'10px'}} >
              <button
                className=" btn-primary w-80 py-2 mb-3 d-flex justify-content-center align-items-center"
                style={{ background: "#ff3366", border: "none", color: "#fff", width: "70%", height: "50px", fontSize: "16px", fontWeight: "600", marginTop:'15px'}}
                onClick={handleVerifyOTP}
                disabled={isLoading} // Disable button when loadings
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
            </div>
          )}
    </section>
  );
};

export default SignInForm;
