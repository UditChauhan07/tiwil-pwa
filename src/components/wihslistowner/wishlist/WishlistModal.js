import React, { useState } from "react";
import axios from "axios";
import styles from "../wishlist/WishlistModal.module.css";
import Swal from "sweetalert2";
import Loader from '../../Loader/Loader';
import imageCompression from "browser-image-compression";

const WishlistModal = ({ closeModal, eventId, refreshWishlist, show, setShow }) => {
  const [giftName, setGiftName] = useState("");
  const [price, setPrice] = useState("");
  const [productLink, setProductLink] = useState("");
  const [desireRate, setDesireRate] = useState(40);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.5, // Max file size in MB
        maxWidthOrHeight: 600, // Max width/height
        useWebWorker: true, // Enable WebWorker for better performance
        fileType: "image/webp", // Convert to WebP
      };

      // Compress and convert image
      const compressedFile = await imageCompression(file, options);

      // Convert compressed file to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(compressedFile); // Save the compressed file instead of base64
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("❌ Error compressing image:", error);
    }
  };

  const validateForm = () => {
    let newErrors = {};
  
    // Check if giftName is null, undefined, or empty, and apply validation for length and format
    if (!giftName || !giftName.trim()) {
      newErrors.giftName = "Gift Name is required.";
    } else if (!/^[a-zA-Z\s]{1,30}$/.test(giftName)) {
      newErrors.giftName = "Only letters & spaces allowed (max 30 characters).";
    }
  console.log('jai ho')
    // Check if price is null, undefined, or empty, and apply validation for numeric format
    if (!price || !price.trim()) {
      newErrors.price = "Price is required.";
    } else if (!/^\d{1,8}$/.test(price)) {
      newErrors.price = "Only numbers allowed (max 8 digits).";
    }
  
    // Check if description is null, undefined, or empty, and apply validation for max word count
    if (!description || !description.trim()) {
      newErrors.description = "Description is required.";
    } else if (description.trim().split(" ").length > 10) {
      newErrors.description = "Max 10 words allowed.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    if (field === "giftName") setGiftName(value);
    if (field === "price") setPrice(value);
    if (field === "description") setDescription(value);

    // Clear errors when the user modifies the field
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!validateForm()) return; // Stop if validation fails

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
      formData.append("image", imageFile); // Directly append the compressed image file
    } else {
      console.log("⚠️ No image selected.");
    }

    setLoading(true);

    console.log(formData)

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/wishlist`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
       Swal.fire({
                      title: "Success",
                      text: "Wishlist added successfully!",
                      icon: "success",
                      confirmButtonColor: "#ff3366" // Custom confirm button color
                    });
                    
        setShow(false);
        refreshWishlist(); // Refresh the wishlist after adding
      }
    } catch (error) {
      console.error("❌ Error saving wishlist item:", error);
      Swal.fire("Error", "Failed to add wishlist item.", "error");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={show ? styles.modalOverlay : styles.hidden}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={() => setShow(false)}>×</button>
        <h2>Add Wishlist Item</h2>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className={styles.imageContainer}>
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Wishlist Item"
                  className={styles.wishlistImage} loading="lazy"   
                  style={{ filter: uploading ? "blur(10px)" : "none", transition: "filter 0.5s ease-in-out" }}
                />
              ) : (
                <img
                  src={`${process.env.PUBLIC_URL}/assets/ps5.png`}
                  alt="Wishlist Item"
                  className={styles.wishlistImage} loading="lazy"   
                />
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className={styles.fileInput} id="fileUpload" />
              <label htmlFor="fileUpload" className={styles.cameraButton}>📷</label>
            </div>

            <div className={styles.form}>
              <input type="text" placeholder="Gift Name" value={giftName} onChange={(e) => handleInputChange(e, "giftName")} />
              {errors.giftName && <span className={styles.error}>{errors.giftName}</span>}

              <input type="number" placeholder="Price" value={price} onChange={(e) => handleInputChange(e, "price")} />
              {errors.price && <span className={styles.error}>{errors.price}</span>}

              <div className={styles.productLink}>
                <input type="text" placeholder="Product link" value={productLink} onChange={(e) => setProductLink(e.target.value)} />
                <button className={styles.addLinkButton}>ADD</button>
              </div>

              <label className={styles.sliderLabel}>Desire Rate: {desireRate}%</label>
              <input type="range" min="0" max="100" value={desireRate} onChange={(e) => setDesireRate(e.target.value)} className={styles.slider} />

              <textarea placeholder="Describe it..." value={description}  onChange={(e) => handleInputChange(e, "description")}></textarea>
              {errors.description && <span className={styles.error}>{errors.description}</span>}
              <button className={styles.saveButton} onClick={handleSave}>Save +</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistModal;
