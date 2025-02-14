import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import './eventModal.css'
const EditEventModal = ({ show, setShow, event, setEvent }) => {
  if (!event) {
    return null; // Return null if the event prop is undefined or not available
  }

  const [title, setTitle] = useState(event.title || "");
  const [date, setDate] = useState(event.eventDate || "");
  const [location, setLocation] = useState(event.location || "");
  const eventId = event._id; // Event ID passed down from the parent
const userId=localStorage.getItem("user.id")
  // Handle form submission
  const handleSave = async () => {
    const updatedEvent = {
      title,
      eventDate: date,
      location,
      userId
    };

    try {
      // Send updated data to the backend
      const response = await axios.put(
        `http://localhost:3001/api/updateEvent/${eventId}`,
        updatedEvent
      );

      if (response.status === 200) {
        // Successfully updated, update the event in the parent component
        setEvent((prevEvents) =>
          prevEvents.map((e) => e._id === eventId ? { ...e, ...updatedEvent } : e)
        );
        setShow(false); // Close the modal
        alert("Event updated successfully!");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event. Please try again.");
    }
  };

  return (
   <Modal show={show} onHide={() => setShow(false)} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>Wishlist Form</Modal.Title>
        </Modal.Header>
  
        <Modal.Body>
         
  
          {/* Form Fields */}
          <Form className="mt-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Event Name</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={title}
               
                placeholder="name of event"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Date of event</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={date}
               
                placeholder="The date od event"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Location</Form.Label>
              <InputGroup>
                <Form.Control
                  type="url"
                  name="productLink"
                  value={location}
               
                  placeholder="Enter event location"
                />
                
              </InputGroup>
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
