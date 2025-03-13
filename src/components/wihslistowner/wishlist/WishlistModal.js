import React, { useState } from "react";
import axios from "axios";
import styles from "../wishlist/WishlistModal.module.css";
import Swal from "sweetalert2";
import Loader from '../../Loader/Loader';

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      setUploading(true);
      setImageFile(file); // ✅ Hamesha sirf File Save Karni Hai
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // ✅ Sirf Preview Ke Liye Base64
        setTimeout(() => {
          setUploading(false);
        }, 2000);
      };
      reader.readAsDataURL(file); // ✅ Ye sirf preview ke liye hai, bhejna nahi
    }
  };
  
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
  
    if (imageFile instanceof File) {  // ✅ Ensure imageFile is File, not Base64
      formData.append("image", imageFile);
    } else {
      console.error("❌ Image file is not valid:", imageFile);
    }
  
    console.log("🔍 FormData Debug:", [...formData.entries()]); // Debugging ke liye
  
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/wishlist`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        Swal.fire("Success", "Wishlist item added successfully!", "success");
        refreshWishlist();
        setShow(false);
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
                  className={styles.wishlistImage}
                  style={{ filter: uploading ? "blur(10px)" : "none", transition: "filter 0.5s ease-in-out" }}
                />
              ) : (
                <img
                  src={`${process.env.PUBLIC_URL}/assets/ps5.png`}
                  alt="Wishlist Item"
                  className={styles.wishlistImage}
                />
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className={styles.fileInput} id="fileUpload" />
              <label htmlFor="fileUpload" className={styles.cameraButton}>📷</label>
            </div>

            <div className={styles.form}>
              <input type="text" placeholder="Gift Name" value={giftName} onChange={(e) => setGiftName(e.target.value)} />
              <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

              <div className={styles.productLink}>
                <input type="text" placeholder="Product link" value={productLink} onChange={(e) => setProductLink(e.target.value)} />
                <button className={styles.addLinkButton}>ADD</button>
              </div>

              <label className={styles.sliderLabel}>Desire Rate: {desireRate}%</label>
              <input type="range" min="0" max="100" value={desireRate} onChange={(e) => setDesireRate(e.target.value)} className={styles.slider} />

              <textarea placeholder="Describe it..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

              <button className={styles.saveButton} onClick={handleSave}>Save +</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistModal;
