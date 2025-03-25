import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import './eventModal.css';
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";

const EditEventModal = ({ show, setShow, event, fetchevent }) => {
  if (!event) {
    return null; // Return null if the event prop is undefined or not available
  }
  console.log(event);

  const [location, setLocation] = useState(event.location || "");
  const [description, setDescription] = useState(event.aboutEvent || "");
  const [image, setImage] = useState(event.image || "");
  const [name, setName] = useState(event.name || "");
  const [eventDate, setDate] = useState(event.date || "");
  const { eventId } = useParams();

  // Validation for null, undefined, and character limits
  const validateForm = () => {
    let newErrors = {};

    // Validate Name: Only allow up to 30 characters, no more than that
    if (!name || name.trim() === "") {
      newErrors.name = "Event Name is required.";
    } else if (name.length > 30) {
      newErrors.name = "Event Name cannot be more than 30 characters.";
    }

    // Validate Location: Only allow up to 30 characters, no more than that
    if (!location || location.trim() === "") {
      newErrors.location = "Location is required.";
    } else if (location.length > 30) {
      newErrors.location = "Location cannot be more than 30 characters.";
    }

    // Validate Description: Optional, but add a max length if required
    if (description && description.length > 200) {
      newErrors.description = "Description cannot be more than 200 characters.";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSave = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: "error",
        title: "Form validation failed",
        text: Object.values(newErrors).join(", "),
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const updatedEvent = { description, location, name, eventDate };
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/events/${eventId}`,
        updatedEvent,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Event details updated successfully!",
          timer: 1000,
          showConfirmButton: false,
        });
        setShow(false);
        fetchevent(); // Fetch updated event details
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to update event details.",
          text: response.data.message,
          timer: 1000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update event.",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  };

  // Handle Image Change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // Prevent more than 30 characters for event name and location
  const handleNameChange = (e) => {
    if (e.target.value.length <= 30) {
      setName(e.target.value);
    }
  };

  const handleLocationChange = (e) => {
    if (e.target.value.length <= 30) {
      setLocation(e.target.value);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Edit Event Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form className="mt-4">
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Event Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter event name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Event Date</Form.Label>
            <Form.Control
              type="date"
              name="eventDate"
              value={eventDate}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Location</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                name="location"
                value={location}
                onChange={handleLocationChange}
                placeholder="Enter event location"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">About Event</Form.Label>
            <Form.Control
              type="text"
              name="aboutEvent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
            />
          </Form.Group>

          {/* Image Section */}
          <div className="upload-container" onClick={() => document.getElementById("fileInput").click()}>
      {image ? (
        <img  
  src={image ? `${process.env.REACT_APP_BASE_URL}/${image}` :   <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><path d="M256 0c70.426 0 134.432 28.793 180.819 75.181C483.207 121.568 512 185.574 512 256c0 70.419-28.793 134.432-75.181 180.819C390.432 483.207 326.426 512 256 512c-70.419 0-134.432-28.793-180.819-75.181C28.793 390.432 0 326.419 0 256c0-70.419 28.793-134.432 75.181-180.819C121.568 28.793 185.581 0 256 0zm-49.948 211.203c-3.827-.162-6.548-1.438-8.119-3.824-4.264-6.39 1.557-12.704 5.588-17.148 11.459-12.566 39.518-42.773 45.172-49.427 4.281-4.731 10.383-4.731 14.661 0 5.841 6.823 35.318 38.408 46.205 50.629 3.776 4.253 8.45 10.057 4.514 15.946-1.607 2.386-4.294 3.662-8.125 3.824h-23.25v57.461c0 6.135-5.032 11.175-11.171 11.175H240.48c-6.139 0-11.171-5.029-11.171-11.175v-57.461h-23.257zm-70.267 58.286c-1.279-5.282.877-9.431 4.319-11.892a12.073 12.073 0 014.139-1.878 12.086 12.086 0 014.524-.23c4.193.602 8.014 3.306 9.304 8.606a330.17 330.17 0 012.223 9.852l1.756 8.656c2.295 11.581 3.997 18.847 8.275 22.465 4.521 3.828 13.087 5.151 29.5 5.151h115.284c15.148 0 23.057-1.452 27.212-5.209 4.007-3.621 5.578-10.707 7.612-21.581l.111-.561c1.066-5.74 2.237-11.943 3.889-18.773 1.289-5.296 5.107-8.004 9.303-8.606a12.099 12.099 0 014.525.23c1.472.355 2.897.995 4.138 1.878 3.442 2.45 5.598 6.6 4.319 11.889-1.506 6.227-2.663 12.403-3.723 18.075l-.061.329c-2.971 15.888-5.438 26.816-13.614 34.498-8.096 7.608-20.78 10.83-43.711 10.83H199.825c-23.98 0-37.162-2.887-45.639-10.396-8.691-7.7-11.324-18.871-14.678-35.816l-1.78-8.839a299.05 299.05 0 00-1.943-8.678zM256 24.604c127.271 0 231.396 104.125 231.396 231.396 0 127.271-104.125 231.396-231.396 231.396-127.267 0-231.396-104.125-231.396-231.396C24.604 128.729 128.733 24.604 256 24.604z"/></svg>} 
   

  className="uploaded-image" />
      ) : (
        <div className="upload-icon">
          <FaCloudUploadAlt size={50} color="#E11531" />
          <p>Upload Image</p>
        </div>
      )}
      <input type="file" id="fileInput" accept="image/*" onChange={handleImageChange} hidden />
    </div>
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

export default EditEventModal;
