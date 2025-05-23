// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { Link } from "react-router-dom";
// import PhoneInput from "react-phone-number-input";
// import "react-phone-number-input/style.css";
// import { Spinner } from "react-bootstrap";
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { initializeApp } from "firebase/app";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAS6KhuPYihmJFO0pCFt0wXjrx_abiLorY",
//   authDomain: "tiwil-718cf.firebaseapp.com",
//   projectId: "tiwil-718cf",
//   storageBucket: "tiwil-718cf.firebasestorage.app",
//   messagingSenderId: "385369508354",
//   appId: "1:385369508354:web:e99f7239e7a8671553b51b",
//   measurementId: "G-R6T8CV0QRG",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// auth.languageCode = "en";

// const SignUpForm = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phoneNumber: "",
//     otp: "",
//   });
//   const [active, setActive] = useState("signup");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [confirmationResult, setConfirmationResult] = useState(null);
//   const navigate = useNavigate();
//   const [nameError, setNameError] = useState(""); // Name validation error
//   const [phoneError, setPhoneError] = useState("");

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//   const validateName = (fullName) => {
//     const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
//     if (!nameRegex.test(fullName)) {
//       setNameError("should only contain letters and spaces and must be between 3 to 25 word.");
//       return false;
//     }
//     if (fullName.length > 25) {
//       setNameError("Name cannot exceed 25 characters.");
//       return false;
//     }
//     setNameError("");
//     return true;
//   };

//   // Phone Number Validation (9 to 15 digits)
//   const isPhoneValid = (phone) => {
//     const cleanedPhone = phone?.replace(/\D/g, ""); // remove non-digits
//     if (cleanedPhone.length < 9 || cleanedPhone.length > 15) {
//       setPhoneError("Phone number must be between 9 to 15 digits.");
//       return false;
//     }
//     setPhoneError("");
//     return true;
//   };

//   // Set up Firebase reCAPTCHA verifier
//   const setupRecaptcha = () => {
//     if (!window.recaptchaVerifier) {
//       console.log("🔄 Initializing reCAPTCHA...");

//       try {
//         window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//           size: "invisible",
//           callback: (response) => {
//             console.log("✅ reCAPTCHA solved:", response);
//           },
//           "expired-callback": () => {
//             console.warn("⚠️ reCAPTCHA expired. Resetting...");
//             window.recaptchaVerifier = null;
//             setupRecaptcha();
//           },
//         });

//         window.recaptchaVerifier.render().then((widgetId) => {
//           console.log("✅ reCAPTCHA rendered with widget ID:", widgetId);
//         }).catch((err) => {
//           console.error("❌ Error rendering reCAPTCHA:", err);
//         });

//       } catch (error) {
//         console.error("❌ Error setting up reCAPTCHA:", error);
//       }
//     } else {
//       console.warn("⚠️ reCAPTCHA already initialized.");
//     }
//   };

//   useEffect(() => {
//     setupRecaptcha();
//   }, [isOtpSent]);
//   if (!validateName(formData.fullName) || !isPhoneValid(formData.phoneNumber)) {
//     setLoading(false);
//     return;
//   }

//   const handleSendOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (!window.recaptchaVerifier) {
//         console.warn("⚠️ reCAPTCHA is not initialized. Initializing now...");
//         setupRecaptcha();
//       }

//       const appVerifier = window.recaptchaVerifier;
//       const result = await signInWithPhoneNumber(auth, formData.phoneNumber, appVerifier);

//       setConfirmationResult(result);
//       setIsOtpSent(true);
//       Swal.fire("Success", "OTP sent successfully!", "success");

//     } catch (error) {
//       console.error("❌ Error sending OTP:", error);
//       Swal.fire("Error", error.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (!confirmationResult) {
//         throw new Error("No OTP request found. Please request OTP again.");
//       }
//       const result = await confirmationResult.confirm(formData.otp);
//       const user = result.user;

//       Swal.fire("Success", "Phone verified successfully!", "success");

//       localStorage.setItem("fullName", formData.fullName);
//       localStorage.setItem("phoneNumber", user.phoneNumber);
//       navigate("/profile");
//     } catch (error) {
//       Swal.fire("Error", error.message, "error");
//       console.error("Error verifying OTP:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="page-controls">
//     <div className="container d-flex flex-column align-items-center justify-content-center">
//       <div className="text-center">
//         <h2 className="font-weight-bold mt-2 mb-0" style={{ fontSize: "48px" }}>Welcome</h2>
//         <p className="text-muted">Connect with your friends today!</p>
//       </div>
//       <div className="d-flex justify-content-center">
//           <Link to="/signin">
//             <p
//               onClick={() => setActive("signin")}
//               style={{
//                 fontSize: "1rem",
//                 border: "1px solid rgb(216, 210, 210)",
//                 padding: "2px 24px 0px 30px",
//                 backgroundColor: active === "signin" ? "#ddd" : "transparent",
//                 fontWeight: active === "signin" ? "bold" : "600",
//                 cursor: "pointer",
//                 color: "#ff3366",
//               }}
//             >
//               Sign in
//             </p>
//           </Link>
//           <Link to="/signup">
//             <p
//               onClick={() => setActive("signup")}
//               style={{
//                 border: "1px solid rgb(238, 234, 234)",
//                 padding: "2px 24px 0px 30px",
//                 color: active === "signup" ? "#ffffff" : "#ff3366",
//                 backgroundColor: active === "signup" ? "#ff3366" : "transparent",
//                 fontWeight: "600",
//                 cursor: "pointer",
//               }}
//             >
//               Sign up
//             </p>
//           </Link>
//         </div>
//       <div className="w-100 p-4 rounded shadow-sm" style={{ maxWidth: "400px", backgroundColor: "#fff" }}>
//         {!isOtpSent ? (
//           <form onSubmit={handleSendOTP}>
//             <div className="mb-3">
//               <label htmlFor="fullName" className="form-label">Full Name</label>
//               <input
//                 type="text"
//                 className={form-control `${nameError ? 'is-invalid' : ''}`}
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 placeholder="Enter full name"
//                 required
//               />
//                {nameError && <div className="invalid-feedback d-block">{nameError}</div>}

//             </div>

//             <div className="mb-3">
//               <label htmlFor="phoneNumber" className="form-label">Phone</label>
//               <PhoneInput
//                 international
//                 countryCallingCodeEditable={false}
//                 defaultCountry="IN"
//                 value={formData.phoneNumber}
//                 onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
//                 className={form-control `${phoneError ? 'is-invalid' : ''}`}
//                 placeholder="Enter phone"
//               />

//             {phoneError && <div className="invalid-feedback d-block">{phoneError}</div>}
//             </div>
//             <button type="submit" className="btn btn-danger w-100 py-2 mb-3" disabled={loading}>
//               {loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                   Sending OTP...
//                 </>
//               ) : (
//                 "Send OTP"
//               )}
//             </button>
//             <div id="recaptcha-container"></div>
//           </form>
//         ) : (
//           <form onSubmit={handleVerifyOTP}>
//             <div className="mb-3">
//               <label htmlFor="otp" className="form-label">OTP</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="otp"
//                 value={formData.otp}
//                 onChange={handleChange}
//                 placeholder="Enter OTP"
//                 required
//               />
//             </div>

//             <button type="submit" className="btn btn-danger w-100 py-2 mb-3" disabled={loading}>
//               {loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                   Verifying OTP...
//                 </>
//               ) : (
//                 "Verify OTP"
//               )}
//             </button>
//           </form>
//         )}
//         <p className="text-muted mt-3">
//           Already registered? <Link to="/signin" className="text-primary fw-semibold text-decoration-none">Sign In</Link>
//         </p>
//       </div>
//     </div>
//   </section>
//   );
// };

// export default SignUpForm;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Spinner } from "react-bootstrap";
import OtpInput from "react-otp-input";
// import { RecaptchaVerifier, signInWithPhoneNumber,getAuth } from "firebase/auth";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../firebase/firebase.js";
import axios from "axios";
import { setAuth, getAuth, clearAuth } from "./auth";

const logo = `${process.env.PUBLIC_URL}/img/letsgo2.svg`;
const SignUpForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    otp: "",
  });
  const [active, setActive] = useState("signup");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const recaptchaVerifierRef = useRef(null);
  const recaptchaSetupComplete = useRef(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0); // Optional: Limit resends
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    
    "Almost there...",
    "Securing the connection...",
    "Hang tight, verifying...",
    "Just a moment..."
  ];
  const logo = `${process.env.PUBLIC_URL}/img/letsgo2.svg`;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "fullName") setNameError("");
  };
  console.log("auth", auth);

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

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phoneNumber: value });
    setPhoneError("");
  };

  const validateName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Full name is required.");
      return false;
    }
    const nameRegex = /^[A-Za-z\s]{3,25}$/;
    if (!nameRegex.test(trimmed)) {
      setNameError("Name must be 3-25 characters long, only letters/spaces.");
      return false;
    }
    return true;
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) {
      setPhoneError("Phone number is required.");
      return false;
    }
    if (!isPossiblePhoneNumber(phone)) {
      setPhoneError("Please enter a valid phone number.");
      return false;
    }
    return true;
  };

  //   useEffect(() => {
  //     if (recaptchaSetupComplete.current || !document.getElementById("recaptcha-container")) return;

  //     try {
  //       if (window.location.hostname === "localhost") {
  //         auth.settings.appVerificationDisabledForTesting = true; // Allow bypass for local testing
  //         console.log("✔ appVerificationDisabledForTesting enabled");
  //       }

  //       const verifier = new RecaptchaVerifier(auth,"recaptcha-container", {
  //         size: "normal",
  //         callback: (response) => console.log("reCAPTCHA solved:", response),
  //         "expired-callback": () => Swal.fire("Warning", "reCAPTCHA expired. Try again.", "warning"),
  //       });

  //       verifier.render().then((widgetId) => {
  //         console.log("reCAPTCHA rendered with ID:", widgetId);
  //         window.recaptchaWidgetId = widgetId;
  //       });

  //       recaptchaVerifierRef.current = verifier;
  //       recaptchaSetupComplete.current = true;
  //     } catch (err) {
  //       console.error("❌ Error setting up reCAPTCHA:", err);
  //       Swal.fire("Error", "Failed to setup reCAPTCHA. Try refresh.", "error");
  //     }

  //     return () => {
  //       if (window.recaptchaWidgetId && recaptchaVerifierRef.current) {
  //         recaptchaVerifierRef.current.clear();
  //         console.log("reCAPTCHA cleared after error.");
  //       }
  //       const container = document.getElementById("recaptcha-container");
  //       if (container) container.innerHTML = "";
  //       recaptchaSetupComplete.current = false;
  //     };
  //   }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    // if (window.recaptchaVerifier) {
    //   window.recaptchaVerifier.clear(); // This will clear the old CAPTCHA state
    // }

    // Set new state to indicate OTP is being sent
    setIsOtpSent(false);
    setCanResend(false);
    setResendCooldown(60);

    const isNameValid = validateName(formData.fullName);
    const isPhoneValid = validatePhoneNumber(formData.phoneNumber);

    if (!isNameValid || !isPhoneValid) return;

    setLoading(true);

    try {
      console.log("Sending request to /signup/send-otp"); // Added log
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/signup/send-otp`,
        {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
        }
      );
      console.log(
        "Received success response from /signup/send-otp:",
        response.status,
        response.data
      ); // Added log

      // This block now likely only handles non-error responses (2xx status)
      // where the backend might *still* indicate failure for other reasons.
      // The "User already exists" case (400 error) is now handled in the catch block.
      if (!response.data.success) {
        console.warn(
          "API returned 2xx status but success: false",
          response.data
        );
        // You might want a different message here if it's not "User exists"
        Swal.fire(
          "Info",
          response.data.message || "Could not initiate OTP process.",
          "info"
        );
        setLoading(false);
        return;
      }

      console.log(
        "API response indicates success: true. Proceeding with reCAPTCHA/OTP flow."
      ); // Added log

      // Step 1: Initialize reCAPTCHA (invisible)
      if (!window.recaptchaVerifier) {
        // Ensure the container exists in your JSX: <div id="recaptcha-container"></div>
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              console.log("✔ reCAPTCHA solved:", response);
            },
            "expired-callback": () => {
              console.warn("⚠ reCAPTCHA expired");
              Swal.fire(
                "Warning",
                "reCAPTCHA expired. Please try again.",
                "warning"
              );
            },
          }
        );
      }

      // Step 2: Add timeout for reCAPTCHA rendering
      const timeout = 10000; // 10 seconds
      const renderRecaptcha = new Promise((resolve, reject) => {
        // Ensure render is only called once if verifier already exists and rendered
        if (window.recaptchaVerifier?.controller?.rendered) {
          resolve(); // Already rendered
        } else {
          window.recaptchaVerifier.render().then(resolve).catch(reject);
        }
      });

      const timeoutPromise = new Promise(
        (_, reject) =>
          setTimeout(() => reject(new Error("reCAPTCHA timeout")), timeout) // Use Error object
      );

      // Step 3: Try to render reCAPTCHA
      try {
        await Promise.race([renderRecaptcha, timeoutPromise]);
        console.log("✅ reCAPTCHA rendered successfully or already rendered.");
      } catch (error) {
        const msg =
          error.message === "reCAPTCHA timeout"
            ? "reCAPTCHA verification timed out. Please check your connection and try again."
            : "Error rendering reCAPTCHA verification please refresh.";
        console.error("❌", msg, error);
        Swal.fire("Error", msg, "error");
        setLoading(false);
        return;
      }

      // Step 4: Request Firebase to send OTP
      console.log("Requesting OTP from Firebase..."); // Added log
      const confirmation = await signInWithPhoneNumber(
        auth,
        formData.phoneNumber,
        window.recaptchaVerifier
      );

      // Step 5: Store confirmation result
      console.log("OTP request successful, confirmation received."); // Added log
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      setCanResend(false);
      setResendCooldown(60);
      setResendAttempts((prev) => prev + 1);

      Swal.fire({
        title: "Success",
        text: "OTP sent successfully!",
        icon: "success",
        confirmButtonColor: "#ff3366", // Custom confirm button color
      });
    } catch (error) {
      console.error("❌ Error caught in handleSendOTP:", error);

      let errorHandled = false;

      // Axios API Error (e.g. 400)
      if (error.response) {
        if (error.response.status === 400) {
          setPhoneError(
            "This phone number is already registered. You can sign in."
          );
          errorHandled = true;
        }
      }

      // Firebase Error
      if (!errorHandled && error.code) {
        let msg = "Failed to send OTP.";
        if (error.code === "auth/invalid-phone-number") {
          msg = "The phone number  is invalid.";
        } else if (error.code === "auth/too-many-requests") {
          msg = "Too many attempts. Try again later.";
        } else if (error.message.includes("reCAPTCHA")) {
          msg = "reCAPTCHA check failed. Please refresh  and try again.";
        }

        setPhoneError(msg);
        errorHandled = true;
      }

      if (!errorHandled) {
        setPhoneError(
          "An unexpected error occurred. Please refresh and try again."
        );
      }

      // Cleanup
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (clearError) {
          console.error("Error clearing reCAPTCHA:", clearError);
        }
      }
    } finally {
      console.log("Running finally block."); // Added log
      setLoading(false); // Ensure loading state is always reset
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    // Step 1: Validate OTP
    // if (!formData.otp || formData.otp.length !== 6) {
    //   Swal.fire("Error", "Enter a valid 6-digit OTP", "error");
    //   return;
    // }

    // Step 2: Check confirmation result exists
    if (!confirmationResult) {
      Swal.fire(
        "Error",
        "OTP session expired. Please send OTP again.",
        "error"
      );
      return;
    }
    if (!formData.otp) {
      setPhoneError({ hasError: true, message: "Please Enter OTP first" });
      return; // Don't proceed if OTP is empty
    }

    if (formData.otp.length !== 6) {
      setPhoneError({
        hasError: true,
        message: "OTP must be exactly 6 digits.",
      });
      return; // Don't proceed if OTP is not 6 digits
    }

    setLoading(true);

    try {
      const result = await confirmationResult.confirm(formData.otp);
      localStorage.setItem("fullName", formData.fullName);
      localStorage.setItem("phoneNumber", result.user.phoneNumber);

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/signup/verify-otp`,
        {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          otp: formData.otp,
        }
      );

      console.log("✅ Backend Response:", response.data);

      if (response.data?.success) {
        const user = response.data?.user;
        const token = response.data?.token;
        const userId = response.data?.userId;

        if (!user || !token || !userId) {
          throw new Error("Missing user, token, or userId in response");
        }

        Swal.fire({
          title: `<div  style="font-size: 20px; color: #EE4266; font-weight: bold;">Dear ${user.fullName}</div>`,
          text: `Account Created Successfully`,
          confirmButtonText: "Let's Go",
          confirmButtonColor: "#FF3366",
          imageUrl: logo,

          imageWidth: 120,
          imageHeight: 120,
        });

        localStorage.setItem("fullName", user.fullName || "");
        localStorage.setItem("phoneNumber", user.phoneNumber || "");
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("profileStatus", false);
        localStorage.setItem("onboardingStatus", false);

        // Optional: Save to IndexedDB
        setAuth(token);

        navigate("/profile");
      } else {
        Swal.fire(
          "Error",
          response.data?.message || "Verification failed",
          "error"
        );
      }
    } catch (error) {
      let msg = "Failed to verify OTP.Please try after some time";
      if (error.code === "auth/invalid-verification-code") {
        msg = "Invalid OTP.";
      } else if (error.code === "auth/code-expired") {
        msg = "OTP expired. Please try again.";
      } else if (error.code === "auth/too-many-requests") {
        msg = "Limit exceeds. Please try again after some time.";
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else {
        msg = error.message || msg;
      }

      Swal.fire("Error", msg, "error");
      setIsOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 1500); // change every 2 seconds
  
      return () => clearInterval(interval);
    }
  }, [loading]);
  
  if (loading) {
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
        <div className="container d-flex flex-column align-items-center justify-content-center">
          <div className="text-center">
            <img
              src={`${process.env.PUBLIC_URL}/img/logomain.svg`}
              alt="logo"
              height="100px"
              width="200px"    
            />
            <h2
              className="font-weight-bold mt-4"
              style={{
                fontSize: "48px",
                fontFamily: "Poppins",
                fontWeight: "500",
                fontSize: "48px",
                lineHeight: "100%",
                letterSpacing: "0%",
                marginBottom: "0px",
              }}
            >
              Welcome
            </h2>
            <p
              style={{
                fontFamily: "Poppins",
                fontWeight: "500",
                fontSize: "12px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                marginBottom: "5px",
              }}
            >
              Connect with your friends today!
            </p>
          </div>
          <div
            className="d-flex justify-content-center mt-4"
            style={{
              padding: "4px",
              border: "1px solid whitesmoke",
              width: "100%",
              height: "40px",
              borderRadius: "5px",
            }}
          >
            <Link to="/signin"  onClick={() => setActive("signin")}
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "18px",
                  borderRadius:'5px',

                  backgroundColor:
                    active === "signin" ? "#EE4266" : "transparent",
                  fontWeight: active === "signin" ? "bold" : "500",
                  cursor: "pointer",
                  color: "#ff3366",
                }}>
              <p
               
              >
                Sign in
              </p>
            </Link>
            <Link to="/signup"  onClick={() => setActive("signup")}
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "18px",
                  borderRadius:'5px',
                  color: active === "signup" ? "#ffffff" : "#ff3366",
                  backgroundColor:
                    active === "signup" ? "#EE4266" : "transparent",
                  fontWeight: "500",
                  cursor: "pointer",
                }}>
              <p
               
              >
                Sign up
              </p>
            </Link>
          </div>
          <div
            className="w-100  "
            style={{
              maxWidth: "800px",
              backgroundColor: "#fff",
              margin: "0 0 40px 0",
              padding: "1.5rem 0rem 1.5rem 0rem",
            }}
          >
            <form noValidate>
              <div className="mb-3 fullnameb ">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className={`form-control ${nameError ? "is-invalid" : ""}`}
                  id="fullName"
                  name="fullName"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                {nameError && (
                  <div className="invalid-feedback d-block">{nameError}</div>
                )}
              </div>
              <div id="recaptcha-container"></div>
              <div className="mb-3 phoneBorder" style={{ border: "none" ,position:'relative'}}>
              <div style={{position:'absolute',right:'15px',top:'17px',zIndex:'999'}}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.0098 12.9267V15.3248C17.0107 15.5474 16.9651 15.7678 16.8759 15.9717C16.7867 16.1757 16.6559 16.3588 16.4918 16.5093C16.3278 16.6598 16.1341 16.7744 15.9232 16.8457C15.7123 16.9171 15.4889 16.9435 15.2671 16.9235C12.8073 16.6562 10.4445 15.8157 8.36858 14.4694C6.43717 13.2421 4.79967 11.6046 3.57237 9.67323C2.22142 7.58784 1.38069 5.21355 1.1183 2.7427C1.09833 2.52165 1.1246 2.29886 1.19544 2.08852C1.26629 1.87818 1.38015 1.68489 1.52979 1.52096C1.67943 1.35704 1.86156 1.22607 2.06459 1.13639C2.26762 1.04671 2.4871 1.00029 2.70905 1.00008H5.10716C5.4951 0.996259 5.87119 1.13363 6.16533 1.3866C6.45948 1.63956 6.6516 1.99085 6.7059 2.37499C6.80711 3.14244 6.99483 3.89597 7.26545 4.62122C7.373 4.90733 7.39628 5.21828 7.33253 5.51722C7.26877 5.81615 7.12066 6.09055 6.90574 6.30789L5.89054 7.32309C7.02849 9.32434 8.6855 10.9814 10.6868 12.1193L11.702 11.1041C11.9193 10.8892 12.1937 10.7411 12.4926 10.6773C12.7916 10.6136 13.1025 10.6368 13.3886 10.7444C14.1139 11.015 14.8674 11.2027 15.6349 11.3039C16.0232 11.3587 16.3778 11.5543 16.6313 11.8535C16.8848 12.1527 17.0195 12.5346 17.0098 12.9267Z" stroke="#EE4266" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div>
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number
                </label>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter phone number"
                  className={`form-contrl ${phoneError ? "is-invalid" : ""}`}
                  style={{
                    display: "flex",
                    borderRadius: " 5px",
                    border: "1px solid grey !important",
                    padding: "6px !important",
                    height: "45px!important",
                  }}
                />
                
              </div>
              {phoneError && (
                  <div className="invalid-feedback d-block"  style={{height:'20px'}}>{phoneError}</div>
                )}
              <div style={{ marginTop: "12px", marginBottom: "12px" }}>
                <span>
                  By creating an account, I accept the{" "}
                  <strong>Terms & Conditions & Privacy Policy</strong>
                </span>
              </div>{" "}
            </form>
            <div
              className="Submit-button"
              style={{
                position: "fixed",
                bottom: "10px",
                width: "100%",
                margin: "auto",
                left: "0",
                padding: "0 20px",
                backgroundColor: "#fff",
              }}
            >
              <button
                type="submit"
                className="btn w-100"
                style={{
                  backgroundColor: "#EE4266",
                  fontWeight: "600",
                  borderRadius: "15px",
                  color: "white",
                }}
              
                onClick={handleSendOTP}
              >
                {loading ? (
                  <Spinner size="sm" animation="border" className="me-2" />
                ) : (
                  "Send OTP"
                )}
              </button>

              <p className="text-center text-muted mt-3">
                <u> Already registered?</u>{" "}
                <u>
                  {" "}
                  <Link to="/signin" className="text-primary fw-bold">
                    Sign In
                  </Link>
                </u>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleVerifyOTP} noValidate>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
              height: "60%",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/img/Otps.webp`}
              alt="logo"
              height="6%"
              width="60%"
              loading="lazy"   
            />
          </div>
          <div className="mb-3">
            {/* <label htmlFor="otp" className="form-label">Enter OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  className="form-control"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="6-digit OTP"
                  required
                />
                  {phoneError.hasError && <div className="invalid-feedback d-block">{phoneError.message}</div>} */}
            <label
              htmlFor="otp"
              className="form-label"
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "85px",
                marginBottom: "30px",
              }}
            >
              Please Enter Otp
            </label>
            <div className="d-flex justify-content-center align-items-center w-70">
              <OtpInput
                className=" form-control "
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
                  width: "40px",
                  height: "40px",
                  margin: "0 6px",
                  fontSize: "20px",
                  fontWeight:'600',
                  borderRadius: "8px",
              border:'none',
                  color: "#000",
                  textAlign: "center",
                  boxShadow: "0px 0px 2px 0px #00000040 inset",
outline:'none',

                  background:'#F2F2F2'
                }}
              />
            </div>{" "}
            {phoneError.hasError && (
              <div
                className="invalid-feedback d-block "
                style={{ textAlign: "center" }}
              >
                {phoneError.message}
              </div>
            )}
          </div>
          <br/>
          {canResend ? (
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button
                type="button"
                onClick={handleSendOTP}
                className="btn "
                style={{
                
                  fontWeight: "600",
                  color: "#EE4266",
                }}
              >
                 <span style={{color:'black',fontWeight:'500px',textDecoration:'unset',fontWeight:'500',fontSize:'14px'}}>Didn't get code?</span>&nbsp;Resend OTP
              </button>
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: "1px" }}>
              <span className="text-muted" > 
                Resend OTP in {resendCooldown}
              </span>
            </div>
          )}
          <div className="d-flex justify-content-center align-items-center" style={{marginTop:'15px'}}>
            <button
              type="submit"
              className=" btn-primary w-80 py-2 mb-3 d-flex justify-content-center align-items-center"
              style={{
                background: "#ff3366",
                border: "none",
                color: "#fff",
                width: "80%",
                height: "50px",
                fontSize: "16px",
                fontWeight: "600",
                marginTop: "20px",
              }}
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" animation="border" className="me-2" />
              ) : (
                "Verify OTP"
              )}
            </button>
            <div className="text-center mt-3"></div>
          </div>
        </form>
      )}
    </section>
  );
};

export default SignUpForm;

// import React, { useState, useEffect, useRef } from "react"; // Added useRef
// import { useNavigate, Link } from "react-router-dom";
// import Swal from "sweetalert2";
// import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input"; // Import validation helper
// import "react-phone-number-input/style.css";
// import { Spinner } from "react-bootstrap";
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { initializeApp, getApps, getApp } from "firebase/app"; // Import getApps/getApp

// /*
//  Make sure you have a .env file in your project root with variables like:
//  REACT_APP_FIREBASE_API_AUTH_KEY=your_api_key
//  REACT_APP_FIREBASE_AUTH_AUTH_DOMAIN=your_auth_domain
//  REACT_APP_FIREBASE_AUTH_PROJECT_ID=your_project_id
//  REACT_APP_FIREBASE_AUTH_STORAGE_BUCKET=your_storage_bucket
//  REACT_APP_FIREBASE_AUTH_MESSAGING_SENDER_ID=your_sender_id
//  REACT_APP_FIREBASE_AUTH_APP_ID=your_app_id
// */

// // Firebase configuration
// const firebaseConfiga = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_AUTH_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_AUTH_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_AUTH_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_AUTH_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_AUTH_APP_ID,
// };

// // Initialize Firebase (handles multiple initializations)
// const app1 =  initializeApp(firebaseConfiga)
// const authService = getAuth(app1);
// authService.languageCode = "en"; // Optional: Set language for confirmation SMS

// const SignUpForm = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phoneNumber: "",
//     otp: "",
//   });
//   const [active, setActive] = useState("signup");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [confirmationResult, setConfirmationResult] = useState(null);
//   const navigate = useNavigate();
//   const [nameError, setNameError] = useState("");
//   const [phoneError, setPhoneError] = useState("");

//   // Ref to store the reCAPTCHA verifier instance
//   const recaptchaVerifierRef = useRef(null);
//   // Ref to ensure setup runs only once reliably
//   const recaptchaSetupComplete = useRef(false);

//   // Handle input change for text fields
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     // Clear name error on change
//     if (e.target.name === 'fullName') {
//         setNameError("");
//     }
//   };

//   // Handle phone number change
//   const handlePhoneChange = (value) => {
//     setFormData({ ...formData, phoneNumber: value });
//     // Clear phone error on change
//     setPhoneError("");
//   }

//   // --- Validation Functions ---
//   const validateName = (name) => {
//     const trimmedName = name.trim();
//     if (!trimmedName) {
//         setNameError("Full name is required.");
//         return false;
//     }
//     // Basic check: Allow letters and spaces, between 3 and 25 chars
//     const nameRegex = /^[A-Za-z\s]{3,25}$/;
//     if (!nameRegex.test(trimmedName)) {
//       setNameError("Name must be 3-25 characters long and contain only letters and spaces.");
//       return false;
//     }
//     setNameError(""); // Clear error if valid
//     return true;
//   };

//   const validatePhoneNumber = (phone) => {
//     if (!phone) {
//         setPhoneError("Phone number is required.");
//         return false;
//     }
//     // Use react-phone-number-input's validation
//     if (!isPossiblePhoneNumber(phone)) {
//          setPhoneError("Please enter a valid phone number.");
//          return false;
//     }
//     // You could add more specific length checks here if needed, but isPossiblePhoneNumber is often sufficient
//     // const cleanedPhone = phone.replace(/\D/g, "");
//     // if (cleanedPhone.length < 9 || cleanedPhone.length > 15) {
//     //      setPhoneError("Phone number must be between 9 to 15 digits.");
//     //      return false;
//     // }

//     setPhoneError(""); // Clear error if valid
//     return true;
//   };

//   // --- Firebase reCAPTCHA Setup ---
//   useEffect(() => {
//     // Ensure this runs only once
//     if (recaptchaSetupComplete.current) return;

//     try {
//        console.log("Setting up reCAPTCHA...");
//        const verifier = new RecaptchaVerifier(authService, 'recaptcha-container', { // Ensure 'recaptcha-container' div exists
//          'size': 'invisible',
//          'callback': (response) => {
//            // reCAPTCHA solved, allow signInWithPhoneNumber.
//            console.log("reCAPTCHA solved, response:", response);
//            // Usually, you don't need to do much here for invisible reCAPTCHA,
//            // as signInWithPhoneNumber triggers it automatically.
//          },
//          'expired-callback': () => {
//            // Response expired. Ask user to solve reCAPTCHA again.
//            console.warn("reCAPTCHA expired. Please try sending OTP again.");
//            Swal.fire("Warning", "reCAPTCHA expired. Please try sending OTP again.", "warning");
//            // Reset the verifier reference if needed, or prompt user action
//            if (recaptchaVerifierRef.current) {
//                 recaptchaVerifierRef.current.render().then(widgetId => {
//                      recaptchaVerifierRef.current.reset(widgetId);
//                 });
//            }
//          }
//        });

//        // Render the reCAPTCHA widget (important for invisible too)
//        verifier.render().then((widgetId) => {
//          console.log("reCAPTCHA rendered with widget ID:", widgetId);
//          window.recaptchaWidgetId = widgetId; // Store widget ID if needed for reset
//        }).catch(err => {
//           console.error("Error rendering reCAPTCHA:", err);
//           Swal.fire("Error", "Could not initialize reCAPTCHA. Please refresh the page.", "error");
//        });

//        recaptchaVerifierRef.current = verifier; // Store the instance in ref
//        recaptchaSetupComplete.current = true; // Mark setup as complete

//     } catch (error) {
//         console.error("Error setting up reCAPTCHA:", error);
//         Swal.fire("Error", "Failed to set up phone sign-in. Please check your connection or configuration.", "error");
//     }

//     // Cleanup function when component unmounts
//     return () => {
//         console.log("Cleaning up reCAPTCHA...");
//         if (recaptchaVerifierRef.current) {
//             try {
//                 // Attempt to clear the container and reset state if possible
//                 recaptchaVerifierRef.current.clear(); // Clears the widget from the DOM
//                 console.log("reCAPTCHA cleared.");
//             } catch (error) {
//                 console.error("Error clearing reCAPTCHA:", error);
//             }
//             recaptchaVerifierRef.current = null;
//         }
//         recaptchaSetupComplete.current = false; // Reset setup flag if component is reused
//     };
//   }, [authService]); // Dependency on auth ensures it's run after Firebase auth is ready

//   // --- Send OTP Logic ---
//   const handleSendOTP = async (e) => {
//     e.preventDefault();
//     setNameError(""); // Clear previous errors
//     setPhoneError("");

//     // Validate inputs first
//     const isNameValid = validateName(formData.fullName);
//     const isPhoneValid = validatePhoneNumber(formData.phoneNumber);

//     if (!isNameValid || !isPhoneValid) {
//       console.log("Validation failed.");
//       return; // Stop if validation fails
//     }

//     if (!recaptchaVerifierRef.current) {
//         console.error("reCAPTCHA Verifier not initialized.");
//         Swal.fire("Error", "reCAPTCHA not ready. Please wait a moment or refresh.", "error");
//         return;
//     }

//     setLoading(true);
//     const appVerifier = recaptchaVerifierRef.current;

//     try {
//        console.log(`Sending OTP to ${formData.phoneNumber}...`);
//        const result = await signInWithPhoneNumber(authService, formData.phoneNumber, appVerifier);
//        console.log("OTP sent successfully. Confirmation Result:", result);

//        setConfirmationResult(result); // Store confirmation result
//        setIsOtpSent(true); // Show OTP input form
//        Swal.fire("Success", "OTP sent successfully!", "success");

//     } catch (error) {
//        console.error("Error sending OTP:", error);
//        // Handle specific errors
//        let errorMessage = "An error occurred while sending the OTP. Please try again.";
//        if (error.code === 'auth/invalid-phone-number') {
//            errorMessage = "Invalid phone number format.";
//            setPhoneError(errorMessage); // Set specific error state
//        } else if (error.code === 'auth/too-many-requests') {
//            errorMessage = "Too many requests. Please try again later.";
//        } else if (error.message.includes('reCAPTCHA')) {
//             errorMessage = "reCAPTCHA verification failed. Please try again.";
//             // Optionally reset reCAPTCHA here if needed
//             if (window.recaptchaWidgetId && recaptchaVerifierRef.current) {
//                 recaptchaVerifierRef.current.reset(window.recaptchaWidgetId);
//             }
//        }

//        Swal.fire("Error", errorMessage, "error");

//        // It might be useful to reset the reCAPTCHA here after an error
//        // grecaptcha.reset(window.recaptchaWidgetId); // If using window.grecaptcha directly
//        if (window.recaptchaWidgetId && recaptchaVerifierRef.current) {
//          try {
//              recaptchaVerifierRef.current.reset(window.recaptchaWidgetId);
//              console.log("reCAPTCHA reset after send error.");
//          } catch (resetError) {
//              console.error("Failed to reset reCAPTCHA:", resetError);
//          }
//        }

//     } finally {
//        setLoading(false);
//     }
//   };

//   // --- Verify OTP Logic ---
//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!confirmationResult) {
//       Swal.fire("Error", "Could not verify OTP. Please try sending the OTP again.", "error");
//       setLoading(false);
//       setIsOtpSent(false); // Go back to phone input step
//       return;
//     }

//     if (!formData.otp || formData.otp.length !== 6) {
//          Swal.fire("Error", "Please enter a valid 6-digit OTP.", "error");
//          setLoading(false);
//          return;
//     }

//     try {
//        console.log(`Verifying OTP: ${formData.otp}`);
//        const result = await confirmationResult.confirm(formData.otp);
//        const user = result.user;
//        console.log("Phone verification successful. User:", user);

//        Swal.fire("Success", "Phone verified successfully!", "success");

//        // Store user info (Consider more secure storage if needed)
//        localStorage.setItem("fullName", formData.fullName);
//        localStorage.setItem("phoneNumber", user.phoneNumber); // Store verified number

//        navigate("/profile"); // Navigate to the next page

//     } catch (error) {
//        console.error("Error verifying OTP:", error);
//         let errorMessage = "Failed to verify OTP. Please check the code and try again.";
//         if(error.code === 'auth/invalid-verification-code') {
//             errorMessage = "Invalid OTP. Please try again.";
//         } else if (error.code === 'auth/code-expired') {
//              errorMessage = "The OTP has expired. Please request a new one.";
//              setIsOtpSent(false); // Go back to send OTP step
//              setConfirmationResult(null); // Clear confirmation result
//         }

//        Swal.fire("Error", errorMessage, "error");
//     } finally {
//        setLoading(false);
//     }
//   };

//   // --- Render Component ---
//   return (
//     <section className="page-controls py-5" style={{ backgroundColor: "#f8f9fa" }}>
//       <div className="container d-flex flex-column align-items-center justify-content-center">
//         <div className="text-center mb-4">
//           <h2 className="font-weight-bold mt-2 mb-0" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>Welcome</h2>
//           <p className="text-muted">Connect with your friends today!</p>
//         </div>

//         {/* Tabs for Sign in / Sign up */}
//         <div className="d-flex justify-content-center mb-4">
//           <Link to="/signin" className="text-decoration-none">
//             <p
//               onClick={() => setActive("signin")}
//               style={{
//                 fontSize: "1rem",
//                 border: "1px solid rgb(216, 210, 210)",
//                 padding: "8px 24px", // Increased padding
//                 backgroundColor: active === "signin" ? "#ddd" : "transparent",
//                 fontWeight: active === "signin" ? "bold" : "600",
//                 cursor: "pointer",
//                 color: "#ff3366",
//                 margin: "0", // Remove default margin
//                 borderTopLeftRadius: "5px",
//                 borderBottomLeftRadius: "5px",
//               }}
//             >
//               Sign in
//             </p>
//           </Link>
//           {/* No Link needed for current page, but keep structure */}
//           {/* <Link to="/signup" className="text-decoration-none"> */}
//              <p
//                onClick={() => setActive("signup")} // Keep active state logic
//                style={{
//                  border: "1px solid rgb(238, 234, 234)",
//                  padding: "8px 24px", // Increased padding
//                  color: active === "signup" ? "#ffffff" : "#ff3366",
//                  backgroundColor: active === "signup" ? "#ff3366" : "transparent",
//                  fontWeight: "600",
//                  cursor: "pointer",
//                  margin: "0", // Remove default margin
//                  borderTopRightRadius: "5px",
//                  borderBottomRightRadius: "5px",
//                  borderLeft: "none", // Avoid double border
//                }}
//              >
//                Sign up
//              </p>
//            {/* </Link> */}
//         </div>

//         {/* Form Container */}
//         <div className="w-100 p-4 rounded shadow-sm" style={{ maxWidth: "400px", backgroundColor: "#fff" }}>
//           {!isOtpSent ? (
//             // --- Sign Up Form (Phone Input) ---
//             <form onSubmit={handleSendOTP} noValidate> {/* Added noValidate */}
//               <div className="mb-3">
//                 <label htmlFor="fullName" className="form-label">Full Name</label>
//                 <input
//                   type="text"
//                   // Use is-invalid class based on error state
//                   className={`form-control ${nameError ? 'is-invalid' : ''}`}
//                   id="fullName" // Added id for label association
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   placeholder="Enter full name"
//                   required
//                   aria-describedby="nameErrorHelp" // For accessibility
//                 />
//                 {/* Display error message conditionally */}
//                 {nameError && <div id="nameErrorHelp" className="invalid-feedback d-block">{nameError}</div>}
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="phoneNumber" className="form-label">Phone</label>
//                 <PhoneInput
//                   international
//                   countryCallingCodeEditable={false}
//                   defaultCountry="IN" // Example default
//                   value={formData.phoneNumber}
//                   onChange={handlePhoneChange} // Use specific handler
//                   // Add class dynamically based on error
//                   className={`form-control ${phoneError ? 'is-invalid' : ''}`}
//                   placeholder="Enter phone number"
//                   id="phoneNumber" // Added id
//                   aria-describedby="phoneErrorHelp" // For accessibility
//                 />
//                  {/* Display error message conditionally */}
//                 {phoneError && <div id="phoneErrorHelp" className="invalid-feedback d-block">{phoneError}</div>}
//               </div>

//               {/* reCAPTCHA Container - Always rendered but invisible */}
//                <div id="recaptcha-container" style={{ marginTop: '10px' }}></div>

//               <button type="submit" className="btn btn-danger w-100 py-2 mb-3" disabled={loading}>
//                 {loading ? (
//                   <>
//                     <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
//                     Sending OTP...
//                   </>
//                 ) : (
//                   "Send OTP"
//                 )}
//               </button>
//             </form>
//           ) : (
//             // --- OTP Verification Form ---
//             <form onSubmit={handleVerifyOTP} noValidate>
//               <div className="mb-3">
//                 <label htmlFor="otp" className="form-label">Enter OTP</label>
//                 <input
//                   type="text" // Keep as text to allow easier input, validation handles format
//                   inputMode="numeric" // Hint for numeric keyboard on mobile
//                   autoComplete="one-time-code" // Helps browsers autofill OTP
//                   className="form-control" // Add validation class if needed later
//                   id="otp" // Added id
//                   name="otp"
//                   value={formData.otp}
//                   onChange={handleChange}
//                   placeholder="Enter 6-digit OTP"
//                   required
//                   maxLength="6" // Limit input length
//                 />
//                 {/* Optional: Add OTP specific error display here */}
//               </div>

//               <button type="submit" className="btn btn-danger w-100 py-2 mb-3" disabled={loading}>
//                 {loading ? (
//                   <>
//                     <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
//                     Verifying OTP...
//                   </>
//                 ) : (
//                   "Verify OTP"
//                 )}
//               </button>
//             </form>
//           )}

//           {/* Link to Sign In */}
//           <p className="text-center text-muted mt-3 mb-0"> {/* Added text-center and mb-0 */}
//             Already registered? <Link to="/signin" className="text-primary fw-semibold text-decoration-none">Sign In</Link>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SignUpForm;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from 'sweetalert2';
// import { Link } from "react-router-dom";
// import PhoneInput from 'react-phone-number-input';
// import 'react-phone-number-input/style.css';
// import { Card, Button, Spinner } from "react-bootstrap";
// import { genToken } from '../../firebase/firebase';

// const SignUpForm = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     otp: "",
//   });
//   const [otpGenerated, setOtpGenerated] = useState(""); // Store generated OTP for display
//   const [isOtpSent, setIsOtpSent] = useState(false); // To show OTP field
//   const [loading, setLoading] = useState(false); // Loading state for OTP sending and verification
//   const [active, setActive] = useState("signup");
//   const [nameError, setNameError] = useState(""); // Name validation error
//   const [phoneError, setPhoneError] = useState(""); // Phone validation error
//   const navigate = useNavigate();
//   const logo = `${process.env.PUBLIC_URL}/img/letsgo2.svg`;

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Name Validation (only letters, max length of 30)
//   const validateName = (fullName) => {
//     const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
//     if (!nameRegex.test(fullName)) {
//       setNameError("should only contain letters and spaces and must be between 3 to 25 word.");
//       return false;
//     }
//     if (fullName.length > 25) {
//       setNameError("Name cannot exceed 25 characters.");
//       return false;
//     }
//     setNameError("");
//     return true;
//   };

//   // Phone Number Validation (9 to 15 digits)
//   const isPhoneValid = (phone) => {
//     const cleanedPhone = phone?.replace(/\D/g, ""); // remove non-digits
//     if (cleanedPhone.length < 9 || cleanedPhone.length > 15) {
//       setPhoneError("Phone number must be between 9 to 15 digits.");
//       return false;
//     }
//     setPhoneError("");
//     return true;
//   };

//   // Handle Send OTP
//   const handleSendOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Validate name and phone
//     if (!validateName(formData.fullName) || !isPhoneValid(formData.phoneNumber)) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup/send-otp`, {
//         fullName: formData.fullName,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//       });

//       if (response.data.success) {
//         setOtpGenerated(response.data.otp); // Display OTP for demo
//         setIsOtpSent(true);
//         Swal.fire("Success", `${response.data.otp}`, "success");
//       } else {
//         Swal.fire("Error", response.data.message, "error");
//       }
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       Swal.fire("Error", error.response?.data?.message || "Error sending OTP.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };
//   function openDatabase() {
//     return new Promise((resolve, reject) => {
//       const request = indexedDB.open("UserDataDB", 1); // Database name and version

//       request.onerror = (event) => {
//         reject("Database error: " + event.target.errorCode);
//       };

//       request.onupgradeneeded = (event) => {
//         const db = event.target.result;
//         if (!db.objectStoreNames.contains("users")) {
//           db.createObjectStore("users", { keyPath: "userId" }); // Store name and key path
//         }
//       };

//       request.onsuccess = (event) => {
//         resolve(event.target.result);
//       };
//     });
//   }
//   async function storeUserDataInIndexedDB(userData) {
//     try {
//       const db = await openDatabase();
//       const transaction = db.transaction(["users"], "readwrite");
//       const store = transaction.objectStore("users");
//       store.put(userData); // Store the user data

//       transaction.oncomplete = () => {
//         console.log("User data stored in IndexedDB");
//       };

//       transaction.onerror = (event) => {
//         console.error("Error storing user data in IndexedDB:", event.target.errorCode);
//       };

//       db.close();
//     } catch (error) {
//       console.error("IndexedDB error:", error);
//     }
//   }

//   // Handle Verify OTP
//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup/verify-otp`, {
//         fullName: formData.fullName,
//         phoneNumber: formData.phoneNumber,
//         otp: formData.otp,
//       });

//       if (response.data.success) {
//         Swal.fire({
//           title: `<div style="font-size: 2rem; color: #FF3366; font-weight: bold;">Dear ${formData.fullName}</div>`,
//           text: 'Account Created Successfully',
//           confirmButtonText: "Let's Go",
//           confirmButtonColor: "#FF3366",
//           imageUrl: logo,
//           imageWidth: 80,
//           imageHeight: 80,
//         });

//         localStorage.setItem("fullName", response.data.user.fullName);
//         localStorage.setItem("phoneNumber", response.data.user.phoneNumber);
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("userId", response.data.userId);
//         localStorage.setItem("profileStatus", false);
//         localStorage.setItem("onboardingStatus", false);

//         const userData = {
//             userId: response.data.userId,
//             fullName: response.data.user.fullName,
//             phoneNumber: response.data.user.phoneNumber,
//             token: response.data.token,
//             profileStatus: false,
//             onboardingStatus: false,
//           };

//           storeUserDataInIndexedDB(userData);

//         navigate("/profile"); // Force profile setup first
//       } else {
//         Swal.fire("Error", response.data.message, "error");
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       Swal.fire("Error", error.response?.data?.message || "Error verifying OTP.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };
//   if (loading) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", marginTop: "150px" }}>
//         <Spinner animation="border" role="status" style={{ width: "10rem", height: "10rem" }} />
//       </div>
//     );
//   }
//   return (
//     <section className="page-controls">
//       <div className="container d-flex flex-column align-items-center justify-content-center">
//         <div className="text-center">
//           <img src={`${process.env.PUBLIC_URL}/img/logomain.svg`} alt="logo" height="150px" width="200px" />
//           <h2 className="font-weight-bold mt-2 mb-0" style={{ fontSize: "48px" }}>Welcome</h2>
//           <p className="text-muted">Connect with your friends today!</p>
//         </div>
//         <div className="d-flex justify-content-center">
//           <Link to="/signin">
//             <p
//               onClick={() => setActive("signin")}
//               style={{
//                 fontSize: "1rem",
//                 border: "1px solid rgb(216, 210, 210)",
//                 padding: "2px 24px 0px 30px",
//                 backgroundColor: active === "signin" ? "#ddd" : "transparent",
//                 fontWeight: active === "signin" ? "bold" : "600",
//                 cursor: "pointer",
//                 color: "#ff3366",
//               }}
//             >
//               Sign in
//             </p>
//           </Link>
//           <Link to="/signup">
//             <p
//               onClick={() => setActive("signup")}
//               style={{
//                 border: "1px solid rgb(238, 234, 234)",
//                 padding: "2px 24px 0px 30px",
//                 color: active === "signup" ? "#ffffff" : "#ff3366",
//                 backgroundColor: active === "signup" ? "#ff3366" : "transparent",
//                 fontWeight: "600",
//                 cursor: "pointer",
//               }}
//             >
//               Sign up
//             </p>
//           </Link>
//         </div>
//         <div className="w-100 p-4 rounded shadow-sm" style={{ maxWidth: "400px", backgroundColor: "#fff" }}>
//           {!isOtpSent ? (
//             <form onSubmit={handleSendOTP}>
//               <div className="mb-3">
//                 <label htmlFor="fullName" className="form-label">Full Name</label>
//                 <input
//                   type="text"
//                   className={`form-control ${nameError ? 'is-invalid' : ''}`}
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   placeholder="Enter full name"

//                 />
//                 {nameError && <div className="invalid-feedback d-block">{nameError}</div>}
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="phoneNumber" className="form-label">Phone</label>
//                 <PhoneInput
//                   international
//                   countryCallingCodeEditable={false}
//                   defaultCountry="IN"
//                   value={formData.phoneNumber}
//                   onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
//                   className={`form-control ${phoneError ? 'is-invalid' : ''}`}
//                   placeholder="Enter phone"
//                   style={{display:'flex'}}

//                 />
//                 {phoneError && <div className="invalid-feedback d-block">{phoneError}</div>}
//               </div>
//               <button type="submit" className="btn btn-danger w-100 py-2 mb-3" disabled={loading}>
//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                     Sending OTP...
//                   </>
//                 ) : (
//                   "Send OTP"
//                 )}
//               </button>
//             </form>
//           ) : (
//             <form onSubmit={handleVerifyOTP}>
//               <div className="mb-3">
//                 <label htmlFor="otp" className="form-label">OTP</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="otp"
//                   value={formData.otp}
//                   onChange={handleChange}
//                   placeholder="Enter OTP"
//                   required
//                 />
//               </div>
//               <button type="submit" className="btn btn-danger w-100 py-2 mb-3" disabled={loading}>
//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                     Verifying OTP...
//                   </>
//                 ) : (
//                   "Verify OTP"
//                 )}
//               </button>
//             </form>
//           )}
//           <p className="text-muted mt-3" style={{ marginLeft: '24px' }}>
//             Already registered? <Link to="/signin" className="text-primary fw-semibold text-decoration-none">Sign In</Link>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SignUpForm;
