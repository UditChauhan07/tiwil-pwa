import { Modal, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { FaCamera, FaCloudUploadAlt } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Wishlist/addtowish.css";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { getAuth } from "../Authentication/auth"; // path adjust kar lena as per structure


const AddEvents = ({ show, setShow, setActiveTab }) => {
  const token = getAuth();

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    setToday(todayDate);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Event Name is required.";
    } else if (!/^[a-zA-Z\s]{1,50}$/.test(formData.fullName)) {
      newErrors.fullName = "Event Name should only contain letters and spaces (max 50 characters).";
    }

    if (!formData.eventDate) {
      newErrors.eventDate = "Event Date is required.";
    }

    if (!formData.location || formData.location.trim() === "") {
      newErrors.location = "Location is required.";
    } else if (formData.location.length > 100) {
      newErrors.location = "Location must be less than 100 characters.";
    }

    if (formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("eventDate", formData.eventDate);
    formDataToSend.append("description", formData.description);

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

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
        setShow(false);
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

  return (
    <>
      {/* Full screen loader */}
      {/* {loading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Spinner animation="border" role="status" style={{ width: "5rem", height: "5rem" }} />
        </div>
      )} */}

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
        
            {loading ? <Spinner animation="border" role="status" style={{ width: "1rem", height: "1rem" }} />: "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEvents;
