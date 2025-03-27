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
// const firebaseConfiga = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_AUTH_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_AUTH_DOMAIN,
//   projectId:process.env.REACT_APP_FIREBASE_AUTH_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_AUTH_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_AUTH_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_AUTH_APP_ID,

// };
// console.log(firebaseConfiga.apiKey,'jdd;fhud;f')
// console.log(firebaseConfiga.authDomain,'jdd;fhud;f')
// console.log(firebaseConfiga.projectId,'jdd;fhud;f')
// console.log(firebaseConfiga.storageBucket,'jdd;fhud;f')
// console.log(firebaseConfiga.messagingSenderId,'jdd;fhud;f')
// console.log(firebaseConfiga.appId,'jdd;fhud;f')

// // Initialize Firebase
// const authService = initializeApp(firebaseConfiga,"authService");
// const auth = getAuth(authService);
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
//       <div className="container d-flex flex-column align-items-center justify-content-center">
//         <div className="text-center">
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
//                   required
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
//               <div id="recaptcha-container"></div>
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
//           <p className="text-muted mt-3">
//             Already registered? <Link to="/signin" className="text-primary fw-semibold text-decoration-none">Sign In</Link>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SignUpForm;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Card, Button, Spinner } from "react-bootstrap";
import { genToken } from '../../firebase/firebase';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    otp: "",
  });
  const [otpGenerated, setOtpGenerated] = useState(""); // Store generated OTP for display
  const [isOtpSent, setIsOtpSent] = useState(false); // To show OTP field
  const [loading, setLoading] = useState(false); // Loading state for OTP sending and verification
  const [active, setActive] = useState("signup");
  const [nameError, setNameError] = useState(""); // Name validation error
  const [phoneError, setPhoneError] = useState(""); // Phone validation error
  const navigate = useNavigate();
  const logo = `${process.env.PUBLIC_URL}/img/letsgo2.svg`;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Name Validation (only letters, max length of 30)
  const validateName = (fullName) => {
    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
    if (!nameRegex.test(fullName)) {
      setNameError("should only contain letters and spaces and must be between 3 to 25 word.");
      return false;
    }
    if (fullName.length > 25) {
      setNameError("Name cannot exceed 25 characters.");
      return false;
    }
    setNameError("");
    return true;
  };

  // Phone Number Validation (9 to 15 digits)
  const isPhoneValid = (phone) => {
    const cleanedPhone = phone?.replace(/\D/g, ""); // remove non-digits
    if (cleanedPhone.length < 9 || cleanedPhone.length > 15) {
      setPhoneError("Phone number must be between 9 to 15 digits.");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Handle Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate name and phone
    if (!validateName(formData.fullName) || !isPhoneValid(formData.phoneNumber)) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup/send-otp`, {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      });

      if (response.data.success) {
        setOtpGenerated(response.data.otp); // Display OTP for demo
        setIsOtpSent(true);
        Swal.fire("Success", `${response.data.otp}`, "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Swal.fire("Error", error.response?.data?.message || "Error sending OTP.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup/verify-otp`, {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        otp: formData.otp,
      });

      if (response.data.success) {
        Swal.fire({
          title: `<div style="font-size: 2rem; color: #FF3366; font-weight: bold;">Dear ${formData.fullName}</div>`,
          text: 'Account Created Successfully',
          confirmButtonText: "Let's Go",
          confirmButtonColor: "#FF3366",
          imageUrl: logo,
          imageWidth: 80,
          imageHeight: 80,
        });
      
        localStorage.setItem("fullName", response.data.user.fullName);
        localStorage.setItem("phoneNumber", response.data.user.phoneNumber);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("profileStatus", false);
        localStorage.setItem("onboardingStatus", false);
      


        navigate("/profile"); // Force profile setup first
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Swal.fire("Error", error.response?.data?.message || "Error verifying OTP.", "error");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "150px" }}>
        <Spinner animation="border" role="status" style={{ width: "10rem", height: "10rem" }} />
      </div>
    );
  }
  return (
    <section className="page-controls">
      <div className="container d-flex flex-column align-items-center justify-content-center">
        <div className="text-center">
          <img src={`${process.env.PUBLIC_URL}/img/logomain.svg`} alt="logo" height="150px" width="200px" />
          <h2 className="font-weight-bold mt-2 mb-0" style={{ fontSize: "48px" }}>Welcome</h2>
          <p className="text-muted">Connect with your friends today!</p>
        </div>
        <div className="d-flex justify-content-center">
          <Link to="/signin">
            <p
              onClick={() => setActive("signin")}
              style={{
                fontSize: "1rem",
                border: "1px solid rgb(216, 210, 210)",
                padding: "2px 24px 0px 30px",
                backgroundColor: active === "signin" ? "#ddd" : "transparent",
                fontWeight: active === "signin" ? "bold" : "600",
                cursor: "pointer",
                color: "#ff3366",
              }}
            >
              Sign in
            </p>
          </Link>
          <Link to="/signup">
            <p
              onClick={() => setActive("signup")}
              style={{
                border: "1px solid rgb(238, 234, 234)",
                padding: "2px 24px 0px 30px",
                color: active === "signup" ? "#ffffff" : "#ff3366",
                backgroundColor: active === "signup" ? "#ff3366" : "transparent",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Sign up
            </p>
          </Link>
        </div>
        <div className="w-100 p-4 rounded shadow-sm" style={{ maxWidth: "400px", backgroundColor: "#fff" }}>
          {!isOtpSent ? (
            <form onSubmit={handleSendOTP}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  type="text"
                  className={`form-control ${nameError ? 'is-invalid' : ''}`}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
             
                />
                {nameError && <div className="invalid-feedback d-block">{nameError}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">Phone</label>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="IN"
                  value={formData.phoneNumber}
                  onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
                  className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                  placeholder="Enter phone"
                  style={{display:'flex'}}
                  
                />
                {phoneError && <div className="invalid-feedback d-block">{phoneError}</div>}
              </div>
              <button type="submit" className="btn btn-danger w-100 py-2 mb-3" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-3">
                <label htmlFor="otp" className="form-label">OTP</label>
                <input
                  type="text"
                  className="form-control"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  required
                />
              </div>
              <button type="submit" className="btn btn-danger w-100 py-2 mb-3" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Verifying OTP...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          )}
          <p className="text-muted mt-3" style={{ marginLeft: '24px' }}>
            Already registered? <Link to="/signin" className="text-primary fw-semibold text-decoration-none">Sign In</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUpForm;