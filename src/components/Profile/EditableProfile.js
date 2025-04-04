import React, { useState, useEffect } from "react"; // Added useEffect
import axios from "axios";
import styles from "../Profile/EditableProfile.module.css";
import { IoMdCamera } from "react-icons/io";
import { Card, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const EditableProfile = ({ profileData: initialProfileData, onBack, onSave }) => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  // --- 1. Add State for Validation Errors ---
  const [errors, setErrors] = useState({
    fullName: '', // Initialize error state for fullName
    // Add other fields here if they need validation
  });

  // --- 2. Validation Logic for Full Name ---
  const validateFullName = (name) => {
    const trimmedName = name ? name.trim() : ''; // Handle potential null/undefined input

    if (!trimmedName) { // Check if empty after trimming
      return "Full name cannot be empty.";
    }
    if (trimmedName.length > 15) {
      return "Full name cannot exceed 15 characters.";
    }
    // Regex: Allows only letters (A-Z, a-z) and spaces (\s)
    if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
      return "Full name can only contain letters and spaces.";
    }
    return ""; // Return empty string if valid
  };

  // --- 3. Modify handleChange to include validation ---
  const handleChange = (field, value) => {
    // Update form data state
    setProfileData((prev) => ({ ...prev, [field]: value }));

    // Perform validation for fullName on change
    if (field === 'fullName') {
      const errorMsg = validateFullName(value);
      setErrors(prev => ({ ...prev, fullName: errorMsg }));
    }
    // Add validation for other fields here if needed
  };

  // --- 4. Modify handleImageChange to ONLY set state ---
  // It should NOT save automatically anymore. Saving happens via handleSave.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set the selected image file object in state for preview and later upload
      setSelectedImage(file);
      // Optionally update profileData state if you want to track the image name/info there too
      // setProfileData((prev) => ({ ...prev, profileImage: file.name })); // Example
    }
    // REMOVED THE API CALL FROM HERE
  };

  // --- 5. Modify handleSave to include final validation ---
  const handleSave = async (e) => {
    if(e) e.preventDefault(); // Prevent default if used in a form onSubmit

    // --- Perform final validation check before attempting save ---
    const fullNameError = validateFullName(profileData.fullName);
    // Validate other fields if you add more checks:
    // const otherFieldError = validateOtherField(profileData.otherField);

    // Update error state to show any final errors
    setErrors({
        fullName: fullNameError,
        // otherField: otherFieldError
    });

    // If there are any errors, stop the save process
    if (fullNameError /* || otherFieldError */) {
        console.error("Validation failed. Cannot save.");
        alert("Please fix the errors in the form before saving."); // Simple alert
        return; // Stop execution
    }
    // --- End Validation Check ---


    // --- Proceed with saving if validation passed ---
    setLoading(true); // Show spinner
    const formData = new FormData();
    const token = localStorage.getItem('token');

    // Append all profile fields EXCEPT potentially the old profileImage path
    Object.keys(profileData).forEach((key) => {
        // Avoid sending the old image path if a new image is selected or if it shouldn't be sent
        if (key !== 'profileImage') {
            formData.append(key, profileData[key] ?? ''); // Send empty string for null/undefined values
        }
    });

    // Append the NEW profile image file if one was selected
    if (selectedImage) {
      formData.append("profileImage", selectedImage, selectedImage.name); // Include filename
    }
    // Note: If no new image is selected, the backend should ideally
    // know not to clear the existing image unless explicitly told to.

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
       
        // Update localStorage if the image path changed
        if (response.data.data?.profileImage) {
            const profileImagePath = response.data.data.profileImage;
            localStorage.setItem("profileImage", profileImagePath);
        }
        // Crucially, call the onSave callback passed from the parent (Account component)
        // This updates the state in the Account component to reflect the changes.
        onSave(response.data.data);
      } else {
        // Use error message from backend if available
        alert(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Provide more specific error feedback if possible (e.g., check error.response)
      alert("Failed to update profile. An error occurred.");
    } finally {
      setLoading(false); // Hide spinner regardless of success/failure
    }
  };

  // --- 6. Add useEffect for initial validation ---
  useEffect(() => {
      const initialFullNameError = validateFullName(initialProfileData.fullName);
      setErrors(prev => ({ ...prev, fullName: initialFullNameError }));
      // Add initial validation for other fields if needed
  }, [initialProfileData]); // Run only when initial data changes


  // Loading spinner rendering
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', height: '100vh' }}> {/* Center spinner */}
        <Spinner animation="border" role="status" style={{ width: "5rem", height: "5rem" }} />
      </div>
    );
  }

  // Date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        // Basic check for valid date object
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split("T")[0]; // Extract the date in YYYY-MM-DD format
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return ""; // Return empty on error
    }
  };

  // --- 7. JSX with Error Display and Button Disabling ---
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FontAwesomeIcon icon={faArrowLeft} onClick={onBack} style={{cursor: 'pointer'}} /> {/* Make icon clickable */}
        {/* Removed button wrapper around "Profile" text for simplicity */}
        <span style={{fontWeight: 'bold', marginLeft: '10px'}}>Profile</span> {/* Simple text header */}
      </div>
      <div className={styles.profileSection}>
        <div className={styles.profileImageWrapper}>
          <img
            src={
              selectedImage // Show preview of newly selected image
                ? URL.createObjectURL(selectedImage)
                // Show existing image from profileData (check if path exists)
                : profileData.profileImage
                ? `${process.env.REACT_APP_BASE_URL}/${profileData.profileImage}`
                // Fallback placeholder
                : `${process.env.PUBLIC_URL}/assets/profile-placeholder.png` // Adjust placeholder path if needed
            }
            alt="Profile" // Add alt text
            className={styles.profileImage}
          />
          <label className={styles.cameraIcon}>
            <IoMdCamera size={20} />
            <input
                type="file"
                style={{ display: "none" }}
                accept="image/png, image/jpeg, image/gif" // Accept common image types
                onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      {/* Use a form element for better semantics and accessibility */}
      <form className={styles.form} onSubmit={handleSave}>
        {/* Full Name */}
        <div className={styles.formGroup}>
          <label htmlFor="fullNameInput">Full Name</label> {/* Use htmlFor */}
          <input
            id="fullNameInput" // Match label's htmlFor
            type="text"
            value={profileData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            maxLength={16} // Optional: prevents typing > 16 chars
            aria-invalid={!!errors.fullName} // For accessibility
            aria-describedby={errors.fullName ? "fullNameError" : undefined}
          />
          {/* Display validation error message */}
          {errors.fullName && (
             <p id="fullNameError" className={styles.errorText} style={{ color: 'red', fontSize: '0.8em', marginTop: '4px' }}>
                {errors.fullName}
             </p>
          )}
        </div>

        {/* Email (Disabled) */}
        <div className={styles.formGroup}>
          <label htmlFor="emailInput">Email</label>
          <input id="emailInput" type="email" value={profileData.email || ''} disabled />
        </div>

        {/* Phone Number (Disabled) */}
        <div className={styles.formGroup}>
          <label htmlFor="phoneInput">Phone Number</label>
          <input id="phoneInput" type="tel" value={profileData.phoneNumber || ''} disabled />
        </div>

        {/* Gender */}
        <div className={styles.formGroup}>
          <label htmlFor="genderInput">Gender</label>
          <select
            id="genderInput"
            value={profileData.gender || ''} // Default to empty string if null/undefined
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option> {/* Added option */}
          </select>
        </div>

        {/* Date of Birth */}
        <div className={styles.formGroup}>
          <label htmlFor="dobInput">Date of Birth</label>
          <input
            id="dobInput"
            type="date"
            value={formatDate(profileData.dob)} // Format date for input
            onChange={(e) => handleChange("dob", e.target.value)}
             max={new Date().toISOString().split("T")[0]} // Prevent selecting future dates
          />
        </div>

        {/* Marital Status */}
        <div className={styles.formGroup}>
          <label htmlFor="maritalStatusInput">Marital Status</label>
          <select
            id="maritalStatusInput"
            value={profileData.maritalStatus || ''}
            onChange={(e) => handleChange("maritalStatus", e.target.value)}
          >
            <option value="">Select</option>
            <option value="Single">Single</option> {/* Changed from Unmarried */}
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option> {/* Added option */}
            <option value="Widowed">Widowed</option> {/* Added option */}
             <option value="Prefer not to say">Prefer not to say</option> {/* Added option */}
          </select>
        </div>

        <div className={styles.saveButtonWrapper}>
          {/* Disable button if there are errors */}
          <button type="submit" className={styles.saveButton} disabled={!!errors.fullName /* || !!errors.otherField */}>
            Save
          </button>
        </div>
      </form> {/* End form element */}
    </div>
  );
};

export default EditableProfile;