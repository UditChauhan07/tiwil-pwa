import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPhone } from "react-icons/fa";
import logo from "../img/TiwilLOGO1.png"; // Your logo image
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./navbar";
import Swal from 'sweetalert2'

const UserProfile = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [location1, setLocation] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("Married");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract email or phone from URL params
  // const queryParams = new URLSearchParams(location.search);
  // const emailOrPhone = queryParams.get("user.emailOrphone");
  const emailOrPhone=localStorage.getItem("user.emailOrphone")

  useEffect(() => {
    if (emailOrPhone) {
      console.log("Email or Phone to fetch:", emailOrPhone);
      axios
        .get(`http://localhost:3001/auth/get-profile/${emailOrPhone}`)
        .then((response) => {
          const userData = response.data; // Since it's a single object, no need to access array index
          setFullName(userData.fullName);
          setEmail(userData.email);
          setPhoneNumber(userData.phoneNumber);
          setGender(userData.gender);
          setDob(userData.dob);
          setLocation(userData.locations);
          setMaritalStatus(userData.maritalStatus);
          setLoading(false);
          console.log("Profile data fetched:", userData);
        })
        .catch((err) => {
          console.error("Error fetching profile data:", err);
          setLoading(false);
        });
    }
  }, [emailOrPhone]);
  
  const handleSave = (e) => {
    e.preventDefault();

    // Create a FormData object to send data along with the file
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("gender", gender);
    formData.append("dob", dob);
    formData.append("location1", location1);
    formData.append("maritalStatus", maritalStatus);

    // Append the profile image if available
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    // Log FormData contents to ensure data is properly added
    for (let [key, value] of formData.entries()) {
      console.log(key + ": " + value);
    }

    // Send the data to the backend to update the profile
    axios
      .put("http://localhost:3001/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      })
      .then((response) => {
        Swal.fire({
       
          title: `<div style="font-size: 2rem; color: #FF3366; font-weight: bold;">Dear ${fullName}</div>`,
          text: 'Account Created Successfully',
        
          confirmButtonText: 'Add family info',
          confirmButtonColor: '#FF3366',
          customClass: {
            popup: 'swal-popup',
            title: 'swal-title',
            confirmButton: 'swal-confirm-btn',
            text: 'swal-text',
          },
          imageUrl: logo, // Optional: Set a custom icon or use the default one
          imageWidth: 80,
          imageHeight: 80,
          imageAlt: 'Account Created Successfully',
          padding: '2rem',
          background: '#fff',
        });
        console.log("Profile updated:", response.data);
        navigate(`/additionalinfo?email=${encodeURIComponent(emailOrPhone)}`);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
      });
  };

  return (
    <>
    <section className="page-controls">      <Header />
      <Navbar />
      <div className="container-fluid vh-80 d-flex flex-column align-items-center bg-white">
        <br />
        {/* Logo and Heading */}
        <div className="text-center mb-4">
          <img src={logo} alt="TIWIL Logo" className="mb-2" style={{ height: "60px" }} />
          <h1 className="fw-bold">Profile</h1>
        </div>

        {/* Profile Form */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSave} className="w-75">
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name" required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                value={email}
                
                placeholder="Email" 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text" id="phone-icon">
                  <FaPhone />
                </span>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  required/>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                className="form-select"
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="dob" className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required />
            </div>
            <div className="mb-3">
              <label htmlFor="location1" className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                id="locations"
                value={location1}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="maritalStatus" className="form-label">Marital Status</label>
              <select
                className="form-select"
                id="maritalStatus"
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                required >
                <option value="">Select marital status</option>
                <option value="Unmarried">Unmarried</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>

            {/* Profile Image Upload */}
            <div className="mb-3">
              <label htmlFor="profileImage" className="form-label">Profile Image</label>
              <input
                type="file"
                className="form-control"
                id="profileImage"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
            </div>

            {/* Save Button */}
            <button type="submit" className="btn btn-danger w-100 py-2 mb-3 rounded-pill">
              Save
            </button>
          </form>
        )}
      </div>
      <Footer />
      </section>

    </>
  );
};

export default UserProfile;
