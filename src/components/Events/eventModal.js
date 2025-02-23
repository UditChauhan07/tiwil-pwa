import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import './eventModal.css'
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

const EditEventModal = ({ show, setShow, event, fetchevent  }) => {
  if (!event) {
    return null; // Return null if the event prop is undefined or not available
  }

  const [location, setLocation] = useState(event.location || "");
  const [description, setDescription] = useState(event.aboutEvent || "");
  const { eventId } = useParams();

  // Handle form submission
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedEvent = { description, location };
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

  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Edit Event Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form className="mt-4">
          <Form.Group className="mb-3">
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
              placeholder="Enter event details"
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

export default EditEventModal;
