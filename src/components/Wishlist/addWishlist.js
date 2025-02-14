import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./addtowish.css";
import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";




const WishlistForm = ({ show, setShow, setActiveTab }) => {
    const userId = localStorage.getItem("user.id");
    console.log(userId); // Retrieve userId from localStorage
    const { eventId } = useParams(); // Retrieve eventId from the route parameters
    console.log(eventId);
  
    // Initialize formData with userId and eventId
    const [formData, setFormData] = useState({
      userId: userId || "", // Ensure it's not null
      eventId: eventId || "", // Ensure it's not null
      giftName: "",
      price: "",
      productLink: "",
      desireRate: 40,
      description: "",
    });
  
    console.log(formData);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value, // Dynamically update the specific field
      }));
    };
  
    const handleSave = async () => {
      console.log(formData);
      try {
        console.log('hyy all');
        // Post the formData to the backend
        await axios.post("http://localhost:3001/api/addwishlist", formData); // Adjust API URL
        setShow(false); // Close modal
        setActiveTab("wishlist"); // Switch to wishlist tab
      } catch (error) {
        console.error("Error saving wishlist item:", error);
      }
    };
  
    return (
      <Modal show={show} onHide={() => setShow(false)} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>Wishlist Form</Modal.Title>
        </Modal.Header>
  
        <Modal.Body>
          {/* Image Section */}
          <div className="position-relative text-center">
            <img
              src="https://source.unsplash.com/500x250/?gift,shopping"
              className="img-fluid rounded wishlist-image"
              alt="Wishlist"
            />
            <div className="camera-icon position-absolute">
              <FaCamera size={20} />
            </div>
          </div>
  
          {/* Form Fields */}
          <Form className="mt-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Gift Name</Form.Label>
              <Form.Control
                type="text"
                name="giftName"
                value={formData.giftName}
                onChange={handleInputChange}
                placeholder="The name of item you wish"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Price</Form.Label>
              <Form.Control
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="The price of item"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Product Link</Form.Label>
              <InputGroup>
                <Form.Control
                  type="url"
                  name="productLink"
                  value={formData.productLink}
                  onChange={handleInputChange}
                  placeholder="Enter product link"
                />
                <Button variant="danger">ADD</Button>
              </InputGroup>
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Desire Rate</Form.Label>
              <div className="d-flex align-items-center">
                <input
                  type="range"
                  className="form-range w-100"
                  name="desireRate"
                  min="0"
                  max="100"
                  value={formData.desireRate}
                  onChange={handleInputChange}
                />
                <span className="ms-2 text-muted fw-bold">{formData.desireRate}%</span>
              </div>
            </Form.Group>
  
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Describe It</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe how you love it"
              />
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
  
  export default WishlistForm;
  