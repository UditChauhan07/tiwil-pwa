import React, { useState, useEffect } from "react";
import { Modal, Button, Form,Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";


const WishlistEditModal = ({ show, setShow, wishlist, fetchWishlist }) => {
  if (!wishlist) return null; // Ensure modal doesn't render if wishlist is undefined

  // Initialize state with existing wishlist data
  const [giftName, setGiftName] = useState(wishlist.giftName || "");
  const [description, setDescription] = useState(wishlist.description || "");
  const [price, setPrice] = useState(wishlist.price || "");

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    wishlist.imageUrl ? `${process.env.REACT_APP_BASE_URL}/${wishlist.imageUrl}` : null
  );
    const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (wishlist) {
      setGiftName(wishlist.giftName || "");
      setDescription(wishlist.description || "");
      setPrice(wishlist.price || "");
      setPreviewImage(wishlist.imageUrl ? `${process.env.REACT_APP_BASE_URL}/${wishlist.imageUrl}` : null);
    }
  }, [wishlist]);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image file type (optional)
      const fileType = file.type.split("/")[0];
      if (fileType !== "image") {
        Swal.fire("Error", "Please upload a valid image file.", "error");
        return;
      }
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Validation function
  const validateForm = () => {
    let newErrors = {};

    // Validate Gift Name: Must be between 1 and 50 characters
    if (!giftName || giftName.trim() === "") {
      newErrors.giftName = "Gift Name is required.";
    } else if (giftName.length > 50) {
      newErrors.giftName = "Gift Name cannot be more than 50 characters.";
    }

    // Validate Description: Max 200 characters
    if (description && description.length > 200) {
      newErrors.description = "Description cannot be more than 200 characters.";
    }

    // Validate Price: Must be a positive number and not exceed 8 digits
    if (!price || price <= 0) {
      newErrors.price = "Price must be a positive number.";
    } else if (price > 99999999) {
      newErrors.price = "Price cannot exceed 8 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSave = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("giftName", giftName);
      formData.append("description", description);
      formData.append("price", price);
      
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/wishlist/${wishlist._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Wishlist item updated successfully!",
          timer: 1000,
          showConfirmButton: false,
        });
        setShow(false); // Close modal
        fetchWishlist(); // Refresh wishlist
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to update wishlist item.",
          text: response.data.message,
          timer: 1000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Edit Wishlist Item</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Gift Name */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Gift Name</Form.Label>
            <Form.Control
              type="text"
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              placeholder="Enter gift name"
            />
            {errors.giftName && <span className="text-danger">{errors.giftName}</span>}
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
            {errors.description && <span className="text-danger">{errors.description}</span>}
          </Form.Group>

          {/* Price */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
            {errors.price && <span className="text-danger">{errors.price}</span>}
          </Form.Group>

          {/* Image Upload */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  style={{ width: "100%", height: "auto", borderRadius: "5px" }}
                  alt="Preview" loading="lazy"   
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={handleSave}>
        {loading ? <Spinner animation="border" role="status" style={{ width: "1rem", height: "1rem" }} />: "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WishlistEditModal;
