import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import logo from '../img/letsgo.png';
import logo1 from '../img/TiwilLOGO1.png';

const SignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [emailOrphone, setEmailorphone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isEmailAuth, setIsEmailAuth] = useState(true);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSignUpEmail = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    try {
      const response = await axios.post("http://localhost:3001/auth/signup", { emailOrphone, fullName });
      setOtpSent(true);
      setIsEmailAuth(false);
      Swal.fire({
        title: "Otp Sent successfully",
        text: `Your OTP is: ${response.data.otp}`,
      });
    } catch (error) {
      alert('Already registered');
    }

    setLoading(false); // Hide loader
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    try {
      const response=await axios.post("http://localhost:3001/auth/verify-otp", { otpEntered: otp, emailOrphone, fullName });
      console.log(response.data)
      console.log(response.data.user._id)
      const userid=response.data.user._id;
      console.log(userid)
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Redirect to protected route, e.g., /profile
      }
      localStorage.setItem("user.emailOrphone", emailOrphone);
      localStorage.setItem("user.id",userid);
      Swal.fire({
        title: `<div style="font-size: 2rem; color: #FF3366; font-weight: bold;">Dear ${fullName}</div>`,
        text: 'Account Created Successfully',
        confirmButtonText: "Let's Go",
        confirmButtonColor: "#FF3366",
        imageUrl: logo,
        imageWidth: 80,
        imageHeight: 80,
      });
      navigate(`/userprofile?email=${encodeURIComponent(emailOrphone)}`);
    } catch (error) {
      alert(error,'error');
    }

    setLoading(false); // Hide loader
  };

  return (
    <>
      <section className="page-controls">
        <div className="container d-flex flex-column align-items-center justify-content-center ">
          <div className="text-center mb-4">
            <img src={logo1} alt="logo" height={"200px"} width={"200px"} />
            <h2 className="font-weight-bold mt-3">Welcome</h2>
            <p className="text-muted">Connect with your friends today!</p>
            <h1 className="fw-bold" style={{ fontFamily: "Poppins, sans-serif" }}>Sign Up</h1>
          </div>

          <div className="w-100 p-4 rounded shadow-sm" style={{ maxWidth: "400px", backgroundColor: "#fff" }}>
            {isEmailAuth ? (
              <form onSubmit={handleSignUpEmail}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="emailOrphone" className="form-label">Email/Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="emailOrphone"
                    value={emailOrphone}
                    onChange={(e) => setEmailorphone(e.target.value)}
                    placeholder="Enter email or phone"
                    required
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
              <form onSubmit={handleVerifyOtp}>
                <h4 className="text-center mb-3">Enter OTP</h4>
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label">OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
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
            {otpSent && !isEmailAuth && (
              <div className="text-center mt-2">
                <p className="text-muted">An OTP has been sent to your email or phone. Please check your inbox and enter the OTP.</p>
              </div>
            )}
          </div>
          <p className="text-muted mt-3">
            Already registered? <a href="/signin" className="text-primary fw-semibold text-decoration-none">Sign In</a>
          </p>
        </div>
      </section>
    </>
  );
};

export default SignUpForm;
