import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
const SignInForm = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: "",
  });

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

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/login/verify-otp`,
        {
          phoneNumber: formData.phoneNumber,
          otp: formData.otp,
        }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem(
          "profileStatus",
          JSON.stringify(response.data.profileStatus)
        );
        localStorage.setItem(
          "onboardingStatus",
          JSON.stringify(response.data.onboardingStatus)
        );

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
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <section className="page-controls">
      <div className="container d-flex flex-column align-items-center justify-content-center mt-3">
        <div className="text-center mb-1">
          <img
            src={`${process.env.PUBLIC_URL}/img/TiwilLOGO1.png`}
            alt="tiwillogo"
            height={"200px"}
            width={"200px"}
          />
          <h2 className="font-weight-bold mt-3">Welcome</h2>
          <p className="text-muted">Connect with your friends today!</p>
          <h1 className="fw-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
            Sign In
          </h1>
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
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
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
