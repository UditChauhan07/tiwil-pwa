import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
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
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSave = async () => {
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
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Edit Wishlist Item</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Gift Name</Form.Label>
            <Form.Control
              type="text"
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              placeholder="Enter gift name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </Form.Group>

          

          {/* Image Upload */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="Wishlist Preview"
                  style={{ width: "100%", height: "auto", borderRadius: "5px" }}
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
        <Button variant="danger" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WishlistEditModal;
