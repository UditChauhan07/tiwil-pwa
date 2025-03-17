import React, { useState } from "react";
import axios from "axios";
import styles from "../wihslistowner/wishlist/WishlistModal.module.css";
import Swal from "sweetalert2";
import { Spinner, ProgressBar } from "react-bootstrap"; // Importing ProgressBar

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

  // ✅ Handle File Selection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // Show preview image
    }
  };

  // ✅ Handle Save (Upload with Progress)
  const handleSave = async () => {
    const token = localStorage.getItem("token");
  
    if (!eventId) {
      alert("Event ID is missing.");
      return;
    }

    const formData = new FormData();
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

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/wishlist`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          // ✅ Calculate upload progress percentage
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
                src={preview || `${process.env.PUBLIC_URL}/assets/ps5.png`}
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
                onChange={(e) => setGiftName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

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
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <button className={styles.saveButton} onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save +"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistModal;
