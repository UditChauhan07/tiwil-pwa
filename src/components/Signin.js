import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Ensure you include the styles
import {genToken} from '../firebase/firebase'

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/login/send-otp`,
        { phoneNumber: formData.phoneNumber }
      );

      if (response.data.success) {
        setOtpGenerated(response.data.otp);
        setIsOtpSent(true);
        setMessage(response.data.message);
        Swal.fire({
          icon: "success",
          title: `OTP Sent: ${response.data.otp}`,
          showConfirmButton: false,
          timer: 1500,
        });
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
        text: error.response?.data?.message || "Error sending OTP.",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Handle Verify OTP
  
  const handleVerifyOTP = async () => {
    setIsLoading(true); // Start loading
    console.log("⏳ OTP verification started...");
  
    try {
      console.log("📤 Sending OTP verification request...");
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/login/verify-otp`,
        {
          phoneNumber: formData.phoneNumber,
          otp: formData.otp,
        }
      );
      
      console.log("✅ OTP Verified Response:", response.data);
  
      if (response.data.success) {
        localStorage.setItem("userId", response.data.userId);
        
        const userId=localStorage.getItem("userId")
        console.log("🔄 Generating FCM Token...");
        const fcmToken  = await genToken();
        console.log("✅ Generated FCM Token:", fcmToken );
      Swal.fire({
        icon: "success",
        title: fcmToken ,
      })
        console.log("📤 Saving FCM Token to backend...");
        const FCM_response = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/save-fcm-token`, 
          { userId,fcmToken  }
        );
        console.log("✅ FCM Token Saved Response:", FCM_response.data);
  
        console.log("💾 Storing data in localStorage...");
        localStorage.setItem("token", response.data.token);
      
        localStorage.setItem("profileStatus", JSON.stringify(response.data.profileStatus));
        localStorage.setItem("onboardingStatus", JSON.stringify(response.data.onboardingStatus));
  
        console.log("🔀 Redirecting user...");
        if (!response.data.profileStatus) {
          navigate("/profile");
        } else {
          navigate("/home");
        }
      } else {
        console.warn("❌ OTP verification failed:", response.data.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("🚨 Error verifying OTP:", error.response?.data || error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error verifying OTP.",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false); // Stop loading
      console.log("🔚 OTP verification process completed.");
    }
  };
  

  return (
    <section className="page-controls">
      <div className="container d-flex flex-column align-items-center justify-content-center mt-3">
        <div className="text-center mb-1">
          <img
            src={`${process.env.PUBLIC_URL}/img/TiwilLOGO1.png`}
            alt="tiwillogo"
            height={"150px"}
            width={"200px"}
          />
          <h2 className="font-weight-bold mt-2 mb-0" style={{ fontSize: "48px" }}>Welcome</h2>
          <p className="text-muted">Connect with your friends today!</p>
    
        </div>
        <div>
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
              fontWeight: "600" ,
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
              fontWeight: active === "signup" ? "bold" : "600" ,
              cursor: "pointer",
              color:'#ff3366'
            }}
          >
            Sign up
          </p>
        </Link>
      </div>
    </div>
        <div
          className="w-100 p-4 rounded shadow-sm"
          style={{ maxWidth: "400px", backgroundColor: "#fff" }}
        >
          {!isOtpSent ? (
            <form onSubmit={handleSendOTP}>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <PhoneInput
                  international
                  defaultCountry="IN" // You can change this default country if needed
                   className="form-control"
                  value={formData.phoneNumber}
                  onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
                  placeholder="Enter phone number"
                  required
                  style={{ display:'flex',outline:"none" }}
                />
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
                  className="form-control"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  required
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
              <p>{message}</p>
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
