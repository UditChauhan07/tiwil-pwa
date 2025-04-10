import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Wishlist/addtowish.css";
import { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import Swal from 'sweetalert2'
import { Spinner } from "react-bootstrap";

const AddEvents = ({ show, setShow, setActiveTab }) => {
  const token = localStorage.getItem("token");
  // Initialize formData with userId and eventId
  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    eventDate: "",
    description: "",
    image: "",
  });
  const [today, setToday] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    setToday(todayDate);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the specific field
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // for preview
      setFormData((prevData) => ({
        ...prevData,
        image: file, // ✅ store File object here
      }));
    }
  };
  

  // Validation for the form fields
  const validateForm = () => {
    let newErrors = {};

    // Event Name Validation: Only letters & spaces (max 50 characters)
    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Event Name is required.";
    } else if (!/^[a-zA-Z\s]{1,50}$/.test(formData.fullName)) {
      newErrors.fullName = "Event Name should only contain letters and spaces (max 50 characters).";
    }

    // Event Date Validation: Ensure a valid date
    if (!formData.eventDate) {
      newErrors.eventDate = "Event Date is required.";
    }

    // Location Validation: Max 100 characters
    if (!formData.location || formData.location.trim() === "") {
      newErrors.location = "Location is required.";
    } else if (formData.location.length > 100) {
      newErrors.location = "Location must be less than 100 characters.";
    }

    // Description Validation: Max 200 characters
    if (formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  const resetForm = () => {
    setFormData({
      fullName: "",
      location: "",
      eventDate: "",
      description: "",
      image: "",
    });
    setImage(null);
    setErrors({});
  };
  
  const handleSave = async () => {
    if (!validateForm()) return; // Stop if validation fails

    const token = localStorage.getItem("token");
   

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("eventDate", formData.eventDate);
    formDataToSend.append("description", formData.description);

    if (formData.image) {
      formDataToSend.append("image", formData.image); // ✅ send the real File object
    }
    
    console.log(formDataToSend)
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/custom-event`,
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        Swal.fire("Success", "Event added successfully!", "success");
        resetForm(); 
        setShow(false); // ✅ only close after success
      } else {
        Swal.fire("Error", "Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      Swal.fire("Error", "Failed to add event.", "error");
    } finally {
      setLoading(false);
    }
  };
  if(loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems:'center', marginTop: "250px" }}>
        <Spinner animation="border" role="status" style={{ width: "10rem", height: "10rem" }} />
      </div>
    );
  }

  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Add Event</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Image Section */}
        <div className="position-relative text-center">
          <img
            src={image || ""}
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
            <Form.Label className="fw-bold">Event Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter event name"
            />
            {errors.fullName && <span className="text-danger">{errors.fullName}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Event Date</Form.Label>
            <Form.Control
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              min={today}
            />
            {errors.eventDate && <span className="text-danger">{errors.eventDate}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Location</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
              />
            </InputGroup>
            {errors.location && <span className="text-danger">{errors.location}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter event description"
            />
            {errors.description && <span className="text-danger">{errors.description}</span>}
          </Form.Group>

          <Form.Group>
            <div className="upload-container" onClick={() => document.getElementById("fileInput").click()}>
              {image ? (
                <img src={image} alt="Preview" className="uploaded-image" />
              ) : (
                <div className="upload-icon">
                  <FaCloudUploadAlt size={50} color="#E11531" />
                  <p>Upload Image</p>
                </div>
              )}
              <input type="file" id="fileInput" accept="image/*" onChange={handleImageChange} hidden />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
     
        <Button variant="danger" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEvents;
