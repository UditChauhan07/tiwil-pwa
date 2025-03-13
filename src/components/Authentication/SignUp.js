import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import {genToken} from '../../firebase/firebase'



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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      console.log(response.data)
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
        Swal.fire("Success", "Signup Successful!", "success");

        // const FCM_Token= await genToken();
        // // localStorage.setItem('FCM',FCM_Token)
        // console.log('FCM_Token',FCM_Token);
        
        // //save Fcm
        // const FCM_response = await axios.put(`${PORT}/setUserFCMinDB`, {FCM_Token:FCM_Token})  //19/12/2024
        // console.log(FCM_response);

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

  return (
    <section className="page-controls">
      <div className="container d-flex flex-column align-items-center justify-content-center ">
        <div className="text-center ">
          <img  src={`${process.env.PUBLIC_URL}/img/TiwilLOGO1.png`} alt="logo" height={"150px"}
            width={"200px"} />
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
              border: "1px solid rgb(216, 210, 210)",
              padding: "2px 24px 0px 30px",
              backgroundColor: active === "signin" ? "#ddd" : "transparent",
              fontWeight: active === "signin" ? "bold" :  "600" ,
              cursor: "pointer",
              color:"#ff3366"
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
              fontWeight: "600" ,
              cursor: "pointer",
              
            }}
          >
            Sign up
          </p>
        </Link>
      </div>
    </div>
        <div className="w-100 p-4 rounded shadow-sm" style={{ maxWidth: "400px", backgroundColor: "#fff" }}>
          {!isOtpSent ? (
            <form onSubmit={handleSendOTP}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">Phone</label>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="IN"
                  value={formData.phoneNumber}
                  onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
                  className="form-control"
                  placeholder="Enter phone"
                  required style={{display:'flex'}}
                />
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
        </div>

        <p className="text-muted mt-3">
          Already registered? <Link to="/signin" className="text-primary fw-semibold text-decoration-none">Sign In</Link>
        </p>
      </div>
    </section>
  );
};

export default SignUpForm;
