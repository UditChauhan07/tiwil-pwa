import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Wishlist/addtowish.css";
import { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

const AddEvents = ({ show, setShow, setActiveTab }) => {
  const token = localStorage.getItem("token");
  // Retrieve userId from localStorage

  // Initialize formData with userId and eventId
  const [formData, setFormData] = useState({
    // Ensure it's not null
    fullName: "",
    location: "",
    eventDate: "",
    description: "",
  image:'',
  });
  const [today, setToday] = useState("");
  const [image, setImage] = useState(null);
  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const todayDate = new Date().toISOString().split("T")[0];

    // Set the state with today's date
    setToday(todayDate);
  }, []);
  console.log(formData);

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
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleSave = async () => {
    console.log(formData);
    try {
      console.log("hyy all");
      // Post the formData to the backend
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/custom-event`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShow(false); // Close modal
    } catch (error) {
      console.error("Error saving event :", error);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Add events Form</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Image Section */}
        <div className="position-relative text-center">
          <img
            src=""
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
              placeholder="The name of event "
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Event Date</Form.Label>
            <Form.Control
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              placeholder="Enter Date of event"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Location</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location of event"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Description</Form.Label>
            <div className="d-flex align-items-center">
              <input
                type="textarea"
                className=" w-100"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Wana add description of event"
              />
            </div>
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

export default AddEvents;
