import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import './eventModal.css'
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";

const EditEventModal = ({ show, setShow, event, fetchevent  }) => {
  if (!event) {
    return null; // Return null if the event prop is undefined or not available
  }
console.log(event)
  const [location, setLocation] = useState(event.location || "");
  const [description, setDescription] = useState(event.aboutEvent || "");
  const [image,setImage]=useState(event.image||"")
  const [name, setname] = useState(event.name || "");
  const [eventDate, setDate] = useState(event.date || "");
  const { eventId } = useParams();

  // Handle form submission
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedEvent = { description, location,name,eventDate };
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/events/${eventId}`,
        updatedEvent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShow(false); // Close the modal
      fetchevent();

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Event details updated successfully!",
          timer: 1000,
          showConfirmButton: false,
        });

        setShow(false); // Close the modal
fetchWishlist();  // Fetch updated event details
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
      
    }
  };
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
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
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Event Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              placeholder="Enter event name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Event date</Form.Label>
            <Form.Control
              type="date"
              name="eventDate"
              value={eventDate}
              onChange={(e) => setDate(e.target.value)}
              
            />
          </Form.Group>
            <Form.Label className="fw-bold">Location</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter event location"
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">About event</Form.Label>
            <Form.Control
              type="text"
              name="aboutEvent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
            />
          </Form.Group>
          <div className="upload-container" onClick={() => document.getElementById("fileInput").click()}>
      {image ? (
        <img  src={`${process.env.REACT_APP_BASE_URL}/${image}`}  className="uploaded-image" />
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

export default EditEventModal;
