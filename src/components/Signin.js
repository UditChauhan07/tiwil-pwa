import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import logo from '../img/TiwilLOGO1.png';

const SignInForm = () => {
  const [emailOrphone, setEmailorphone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // Handle sending OTP to the user
  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/auth/signin", { emailOrphone });
      console.log("OTP sent:", response.data);

      setOtpSent(true);
      localStorage.setItem("user.emailOrphone", emailOrphone);
      Swal.fire({
        title: "OTP Sent Successfully",
        text: `Your OTP is: ${response.data.otp}`,
      });
    } catch (error) {
      console.error("Error during sign-in:", error);
      Swal.fire({
        title: "User not registered",
        text: "Please register to login",
      });
      navigate('/signup');
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/auth/veriify-signin-otp", { otpEntered: otp, emailOrphone });
      console.log("Sign-in successful:", response.data);

      const { token, userId } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        // localStorage.setItem("user.emailOrphone", emailOrphone);
        localStorage.setItem("user.id", userId);

        // Redirect to the home page or any protected route
        navigate('/home');
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Swal.fire({
        title: "Invalid OTP",
        text: "Please check the OTP and try again.",
      });
    }
  };

  return (
    <section className="page-controls">
      <div className="container d-flex flex-column align-items-center justify-content-center mt-3">
        <div className="text-center mb-1">
          <img src={logo} alt="tiwillogo" height={"200px"} width={"200px"} />
          <h2 className="font-weight-bold mt-3">Welcome</h2>
          <p className="text-muted">Connect with your friends today!</p>
          <h1 className="fw-bold" style={{ fontFamily: "Poppins, sans-serif" }}>Sign In</h1>
        </div>

        <div className="w-100 p-4 rounded shadow-sm" style={{ maxWidth: "400px", backgroundColor: "#fff" }}>
          {!otpSent ? (
            <form onSubmit={handleSignIn}>
              <div className="mb-3">
                <label htmlFor="Emailorphone" className="form-label">Email/Phone</label>
                <input
                  type="text"
                  className="form-control"
                  id="emailOrphone"
                  value={emailOrphone}
                  onChange={(e) => setEmailorphone(e.target.value)}
                  placeholder="Enter your email or phone"
                  required
                />
              </div>
              <button type="submit" className="btn btn-danger w-100 py-2 mb-3">Send OTP</button>
            </form>
          ) : (
            <>
              <h4 className="text-center mb-3">Enter OTP</h4>
              <form onSubmit={handleVerifyOtp}>
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
                <button type="submit" className="btn btn-danger w-100 py-2 mb-3">Verify OTP</button>
              </form>
            </>
          )}
        </div>
        <p className="text-muted mt-3">
          New on TIWIL? <a href="/signup" className="text-primary fw-semibold text-decoration-none">Create an account</a>
        </p>
      </div>
    </section>
  );
};

export default SignInForm;
