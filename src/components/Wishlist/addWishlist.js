import React, { useState } from "react";
import axios from "axios";
import styles from "../wihslistowner/wishlist/WishlistModal.module.css";
import Swal from "sweetalert2";
import { Spinner, ProgressBar } from "react-bootstrap";
import { useEffect } from "react";

const WishlistModal = ({ eventId, setShow, fetchWishlist,  }) => {
  const [giftName, setGiftName] = useState("");
  const [price, setPrice] = useState("");
  const [productLink, setProductLink] = useState("");
  const [desireRate, setDesireRate] = useState(40);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});

  // ✅ Handle File Selection (simple)
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Validate Form
  const validateForm = () => {
    let newErrors = {};

    if (!giftName || giftName.trim() === "") {
      newErrors.giftName = "Gift Name is required.";
    } else if (!/^[a-zA-Z0-9\s]{1,30}$/.test(giftName)) {
      newErrors.giftName = "Only letters, numbers, and spaces (max 30 characters).";
    }

    if (!price || price.trim() === "") {
      newErrors.price = "Price is required.";
    } else if (!/^\d{1,8}$/.test(price)) {
      newErrors.price = "Only numbers allowed (max 8 digits).";
    }

    if (!description || description.trim() === "") {
      newErrors.description = "Description is required.";
    } else if (description.trim().split(" ").length > 10) {
      newErrors.description = "Max 10 words allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const slider = document.getElementById('desireSlider');
    const val = (desireRate / 100) * 100;
    if (slider) {
      slider.style.background = `linear-gradient(to right, #EE4266 ${val}%, #f8e8eb ${val}%)`;
    }
  }, [desireRate]);


  // ✅ Handle Save (Upload with Progress)
  const handleSave = async () => {
    if (!validateForm()) return;

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
    setUploadProgress(0);

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
         Swal.fire({
                       title: "Success",
                       text: "Wishlist added successfully!",
                       icon: "success",
                       confirmButtonColor: "#ff3366" // Custom confirm button color
                     });
        setShow(false);
        fetchWishlist();
      }
    } catch (error) {
      console.error("❌ Error saving wishlist item:", error);
      Swal.fire("Error", "Failed to add wishlist item.", "error");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => setShow(false);

  const handleInputChange = (e, field) => {
    let value = e.target.value;
    if (value == null) value = "";

    if (field === "giftName" && value.length <= 20) {
      setGiftName(value);
    } else if (field === "price" && /^\d{0,8}$/.test(value)) {
      setPrice(value);
    } else if (field === "description" && value.trim().split(" ").length <= 10) {
      setDescription(value);
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={handleClose}>
          ×
        </button>
        <h4 className={styles.heading}>Add Wishlist </h4>

        {loading ? (
          <div style={{ textAlign: "center" }}>
            <Spinner animation="border" style={{ width: "3rem", height: "3rem" }} />
            <p>Uploading...</p>
          </div>
        ) : (
          <>
            <div className={styles.imageContainer}>
              <img
                src={preview || `${process.env.PUBLIC_URL}/img/ps5.webp`}
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
              <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.4198 3.93809V14.0646C20.4198 14.9964 19.5898 15.7524 18.5667 15.7524H2.50621C1.48313 15.7524 0.653076 14.9964 0.653076 14.0646V3.93809C0.653076 3.00631 1.48313 2.25034 2.50621 2.25034H5.90362L6.37849 1.09352C6.64874 0.436003 7.3398 0 8.11194 0H12.9571C13.7293 0 14.4203 0.436003 14.6906 1.09352L15.1693 2.25034H18.5667C19.5898 2.25034 20.4198 3.00631 20.4198 3.93809ZM15.1693 9.00135C15.1693 6.67366 13.0922 4.78197 10.5365 4.78197C7.98068 4.78197 5.90362 6.67366 5.90362 9.00135C5.90362 11.329 7.98068 13.2207 10.5365 13.2207C13.0922 13.2207 15.1693 11.329 15.1693 9.00135ZM13.9339 9.00135C13.9339 10.7067 12.4089 12.0956 10.5365 12.0956C8.66402 12.0956 7.13905 10.7067 7.13905 9.00135C7.13905 7.29602 8.66402 5.90714 10.5365 5.90714C12.4089 5.90714 13.9339 7.29602 13.9339 9.00135Z" fill="white"/>
</svg>

              </label>
            </div>

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
            <label className={styles.labelss}>Gift Name</label>
              <input
                type="text"
                className={styles.placedesign}
                placeholder="The name of stuff you wish to have"
                value={giftName}
                onChange={(e) => handleInputChange(e, "giftName")}
              />
              {errors.giftName && <span className={styles.error}>{errors.giftName}</span>}
              <label className={styles.labelss}>Price</label>
              <input
              className={styles.placedesign}
                type="number"
                placeholder="The price of stuff"
                value={price}
                onChange={(e) => handleInputChange(e, "price")}
              />
              {errors.price && <span className={styles.error}>{errors.price}</span>}
              <label className={styles.labelss}>Product Link</label>
              <div className={styles.productLink}>
            
                <input
                  type="text"
                  className={styles.placedesign}
                  placeholder="Product link"
                  value={productLink}
                  style={{border:'none',padding:'0px',padddingLeft:'10px',borderRadius:'6px'}}
                  onChange={(e) => setProductLink(e.target.value)}
                />
                <button className={styles.addLinkButton}>ADD</button>
              </div>

              <label className={styles.labelss}>Desire Rate </label>
              <div className="d-flex align-items-center">
      <input
        type="range"
        id="desireSlider"
        min="0"
        max="100"
        value={desireRate}
        onChange={(e) => setDesireRate(e.target.value)}
        style={{ width: '90%' }}
        className={styles.slider}
      />
      {desireRate}%
    </div>
<label className={styles.labelss}>Describe it</label>
              <textarea
                className={styles.placedesignn}
                placeholder="To persuade others to buy it for you, describe how you love it "
                value={description}
                onChange={(e) => handleInputChange(e, "description")}
              ></textarea>
              {errors.description && <span className={styles.error}>{errors.description}</span>}

              <button className={styles.saveButton} onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistModal;
