import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Wishlist/addtowish.css";
import { useState, useEffect } from "react";

const Memberform = ({ show, setShow }) => {
  // Use a single state for form data
  const [formData, setFormData] = useState({
    fullName: "",
    relation: "",
    dob: "",
    gender: "",
    image: null,
  });
  const [today, setToday] = useState('');

  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const todayDate = new Date().toISOString().split('T')[0];

    // Set the state with today's date
    setToday(todayDate);
  }, []);
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  // Handle save event (for both normal and modal form data)
  const handleSave = async () => {
    try {
      const eventData = formData; // Use formData to save

      const formDataToSend = new FormData();
      formDataToSend.append("userId", localStorage.getItem("userId"));
      formDataToSend.append("fullName", eventData.fullName);
      formDataToSend.append("dob", eventData.dob);
      formDataToSend.append("relationType", eventData.relation);
      formDataToSend.append("eventType", eventData.eventType || 'Birthday');

      if (eventData.image) {
        formDataToSend.append("image", eventData.image);
      }

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/create-event`, formDataToSend, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        console.log(response.data);
        setFormData({
          fullName: '',
          relation: '',
          dob,
          eventType: '',
          image: null,
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setShow(false);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Add Member Form</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Image Section */}
        <div className="position-relative text-center">
          <img
            src={formData.image ? URL.createObjectURL(formData.image) : ""}
            className="img-fluid rounded wishlist-image"
         
          />
          <div className="camera-icon position-absolute">
            <FaCamera size={20} />
          </div>
        </div>

        {/* Form Fields */}
        <Form className="mt-4">
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter the name of member"
            />
          </Form.Group>

          {/* Relation Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Relation</Form.Label>
            <Form.Control
              as="select"
              name="relation"
              value={formData.relation}
              onChange={handleInputChange}
            >
              <option value="">Select Relation</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Spouse">Spouse</option>
              <option value="Sibling">Sibling</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>

          {/* Date of Birth */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Date of Birth</Form.Label>
            <InputGroup>
              <Form.Control
                type="date"
                name="dob"   min="1900-01-01" // Minimum date is fixed to 1900-01-01
                max={today} 
                value={formData.dob}
                onChange={handleInputChange}
              />
            </InputGroup>
          </Form.Group>

          {/* Gender Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Gender</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>

          {/* Image Upload */}
          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <input type="file" onChange={handleImageUpload} />
            {formData.image && (
              <p className="uploadedFileName">Selected File: {formData.image.name}</p>
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

export default Memberform;
