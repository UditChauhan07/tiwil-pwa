import React, { useState } from "react";
import axios from "axios";
import styles from "../wihslistowner/wishlist/WishlistModal.module.css";
import Swal from "sweetalert2";
import { Spinner, ProgressBar } from "react-bootstrap"; // Importing ProgressBar
import imageCompression from "browser-image-compression";

const WishlistModal = ({ eventId, setShow, fetchWishlist }) => {
  const [giftName, setGiftName] = useState("");
  const [price, setPrice] = useState("");
  const [productLink, setProductLink] = useState("");
  const [desireRate, setDesireRate] = useState(40);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // ✅ Upload Progress State
  const [errors, setErrors] = useState({}); // Store errors

  // ✅ Handle File Selection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // Show preview image
    }
  };

  // ✅ Validate Form
  const validateForm = () => {
    let newErrors = {};

    // Gift Name Validation: Ensure not null/undefined and meets requirements
    if (!giftName || giftName.trim() === "") {
      newErrors.giftName = "Gift Name is required.";
    } else if (!/^[a-zA-Z\s]{1,30}$/.test(giftName)) {
      newErrors.giftName = "Only letters & spaces allowed (max 30 characters).";
    }

    // Price Validation: Ensure not null/undefined and meets requirements
    if (!price || price.trim() === "") {
      newErrors.price = "Price is required.";
    } else if (!/^\d{1,8}$/.test(price)) {
      newErrors.price = "Only numbers allowed (max 8 digits).";
    }

    // Description Validation: Ensure not null/undefined and meets word count requirements
    if (!description || description.trim() === "") {
      newErrors.description = "Description is required.";
    } else if (description.trim().split(" ").length > 10) {
      newErrors.description = "Max 10 words allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Save (Upload with Progress)
  const handleSave = async () => {
    if (!validateForm()) return; // Stop if validation fails

    const token = localStorage.getItem("token");

    if (!eventId) {
      alert("Event ID is missing.");
      return;
    }

    const formData = new FormData();
    console.log(formData,"formData")
    formData.append("eventId", eventId);
    formData.append("giftName", giftName);
    formData.append("price", price);
    formData.append("productLink", productLink);
    formData.append("desireRate", desireRate);
    formData.append("description", description);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    setLoading(true);
    setUploadProgress(0); // Reset progress bar

    console.log("formDat2222222a",JSON.stringify(formData))

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/wishlist`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        Swal.fire("Success", "Wishlist item added successfully!", "success");
        setShow(false);
        fetchWishlist();
      }
    } catch (error) {
      console.error("❌ Error saving wishlist item:", error);
      Swal.fire("Error", "Failed to add wishlist item.", "error");
    } finally {
      setLoading(false);
      setUploadProgress(0); // Reset after completion
    }
  };

  // ✅ Handle Close
  const handleClose = () => {
    setShow(false);
  };

  // ✅ Handle Input Change and enforce character limits
  const handleInputChange = (e, field) => {
    let value = e.target.value;

    // Check if value is null or undefined before proceeding
    if (value == null) value = "";

    if (field === "giftName") {
      if (value.length <= 30) {
        setGiftName(value);
      }
    } else if (field === "price") {
      if (/^\d{0,8}$/.test(value)) {
        setPrice(value);
      }
    } else if (field === "description") {
      const words = value.trim().split(" ");
      if (words.length <= 10) {
        setDescription(value);
      }
    }

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={handleClose}>
          ×
        </button>
        <h2>Add Wishlist Item</h2>

        {/* Loader */}
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <Spinner animation="border" style={{ width: "3rem", height: "3rem" }} />
            <p>Uploading...</p>
          </div>
        ) : (
          <>
            <div className={styles.imageContainer}>
              <img
                src={preview || `${process.env.PUBLIC_URL}/img/defaultproduct.jpg`}
                alt="Wishlist Item"
                className={styles.wishlistImage}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
                id="fileUpload"
              />
              <label htmlFor="fileUpload" className={styles.cameraButton}>
                📷
              </label>
            </div>

            {/* ✅ Progress Bar (Visible only when uploading) */}
            {uploadProgress > 0 && (
              <ProgressBar
                now={uploadProgress}
                label={`${uploadProgress}%`}
                animated
                striped
                className={styles.progressBar}
              />
            )}

            <div className={styles.form}>
              <input
                type="text"
                placeholder="Gift Name"
                value={giftName}
                onChange={(e) => handleInputChange(e, "giftName")}
              />
              {errors.giftName && <span className={styles.error}>{errors.giftName}</span>}

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => handleInputChange(e, "price")}
              />
              {errors.price && <span className={styles.error}>{errors.price}</span>}

              <div className={styles.productLink}>
                <input
                  type="text"
                  placeholder="Product link"
                  value={productLink}
                  onChange={(e) => setProductLink(e.target.value)}
                />
                <button className={styles.addLinkButton}>ADD</button>
              </div>

              <label className={styles.sliderLabel}>Desire Rate: {desireRate}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={desireRate}
                onChange={(e) => setDesireRate(e.target.value)}
                className={styles.slider}
              />

              <textarea
                placeholder="Describe it..."
                value={description}
                onChange={(e) => handleInputChange(e, "description")}
              ></textarea>
              {errors.description && <span className={styles.error}>{errors.description}</span>}

              <button className={styles.saveButton} onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save "}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistModal;
