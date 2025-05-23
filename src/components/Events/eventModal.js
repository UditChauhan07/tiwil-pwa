import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup,Spinner } from "react-bootstrap";
import axios from "axios";
import './eventModal.css';
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { getAuth } from "../Authentication/auth"; // path adjust kar lena as per structure


const EditEventModal = ({ show, setShow, event, fetchevent }) => {
  if (!event) {
    return null; // Return null if the event prop is undefined or not available
  }
  console.log(event);
  const formatDate = (dateString) => {
    if (!dateString) return "";
  
    const inputDate = new Date(dateString);
    const today = new Date();
  
    const inputMonth = inputDate.getMonth();
    const inputDay = inputDate.getDate();
  
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
  
    let yearToUse;
  
    if (inputMonth > todayMonth || (inputMonth === todayMonth && inputDay > todayDay)) {
      // Future in this year
      yearToUse = today.getFullYear();
    } else if (inputMonth === todayMonth && inputDay === todayDay) {
      // Today
      yearToUse = today.getFullYear();
    } else {
      // Already passed → next year
      yearToUse = today.getFullYear() + 1;
    }
  
    // Build date with corrected year
    const formattedDate = new Date(yearToUse, inputMonth, inputDay);
    return formattedDate.toISOString().split("T")[0]; // returns YYYY-MM-DD
  };
  
  

  const [location, setLocation] = useState(event.location || "");
  const [description, setDescription] = useState(event.description || "");
  const [image, setImage] = useState(event.newimage || event.image || "");

  const [name, setName] = useState(event.name || "");
  const [eventDate, setDate] = useState(""); // leave blank initially
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { eventId } = useParams();

  // Validation for null, undefined, and character limits
  // const validateForm = () => {
  //   let newErrors = {};

  //   // Validate Name: Only allow up to 30 characters, no more than that
  //   if (!name || name.trim() === "") {
  //     newErrors.name = "Event Name is required.";
  //   } else if (name.length > 30) {
  //     newErrors.name = "Event Name cannot be more than 30 characters.";
  //   }

  //   // Validate Location: Only allow up to 30 characters, no more than that
  //   if (!location || location.trim() === "") {
  //     newErrors.location = "Location is required.";
  //   } else if (location.length > 30) {
  //     newErrors.location = "Location cannot be more than 30 characters.";
  //   }

  //   // Validate Description: Optional, but add a max length if required
  //   if (description && description.length > 200) {
  //     newErrors.description = "Description cannot be more than 200 characters.";
  //   }

  //   return newErrors;
  // };

  const validateForm = () => {
    const newErrors = {};
  
    if (!name.trim()) {
      newErrors.name = "Event Name is required.";
    } else if (name.length > 30) {
      newErrors.name = "Event Name cannot be more than 30 characters.";
    }
  
    if (!location.trim()) {
      newErrors.location = "Location is required.";
    } else if (location.length > 30) {
      newErrors.location = "Location cannot be more than 30 characters.";
    }
  
    if (description.length > 100) {
      newErrors.description = "Description cannot be more than 100 characters.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // ✅ true = no errors
  };
  
  // Handle form submission
  const handleSave = async () => {

    const isValid = validateForm();
    if (!isValid) return;
 setLoading(true)
    try {
      const token = getAuth();
      const formData = new FormData();
      formData.append("description", description);
      formData.append("location", location);
      formData.append("name", name);
      if (eventDate) {
        formData.append("eventDate", eventDate); // ✅ only send if user picked a date
      }
      
      if (image && image.startsWith("blob")) {
        formData.append("image", document.getElementById("fileInput").files[0]); // Append file only if changed
      }
  
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/events/${eventId}`,
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
                  title: "Success",
                  text: "Event updated successfully!",
                  icon: "success",
                  confirmButtonColor: "#ff3366" // Custom confirm button color
                });
                
         
        setShow(false);
        fetchevent(); // Refresh event data
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
    finally{
      setLoading(false);
    }
  };
  
  // Handle Image Change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Temporary preview
      setImage(imageUrl);
    }
  };
  

  // Prevent more than 30 characters for event name and location
  const handleNameChange = (e) => {
    if (e.target.value.length <= 30) {
      setName(e.target.value);
    }
  };
  const handledescriptionchange = (e) => {
    if (e.target.value.length <= 100) {
      setDescription(e.target.value);  // Update the description state instead of name
    }
  };
  
  const handleLocationChange = (e) => {
    if (e.target.value.length <= 30) {
      setLocation(e.target.value);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="md" className="wishlist-modal">
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
    onChange={(e) => {
      handleNameChange(e);
      if (errors.name) setErrors({ ...errors, name: "" });
    }}
    placeholder="Enter event name"
    isInvalid={!!errors.name}
  />
  <Form.Control.Feedback type="invalid">
    {errors.name}
  </Form.Control.Feedback>
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
      onChange={(e) => {
        handleLocationChange(e);
        if (errors.location) setErrors({ ...errors, location: "" });
      }}
      placeholder="Enter event location"
      isInvalid={!!errors.location}
    />
    <Form.Control.Feedback type="invalid">
      {errors.location}
    </Form.Control.Feedback>
  </InputGroup>
</Form.Group>

          <Form.Group className="mb-3">
  <Form.Label className="fw-bold">About Event</Form.Label>
  <Form.Control
    as="textarea"
    rows={3}
    name="aboutEvent"
    value={description}
    onChange={(e) => {
      handledescriptionchange(e);
      if (errors.description) setErrors({ ...errors, description: "" });
    }}
    placeholder="Enter event description (max 100 characters)"
    isInvalid={!!errors.description}
  />
  <Form.Control.Feedback type="invalid">
    {errors.description}
  </Form.Control.Feedback>
</Form.Group>



          {/* Image Section */}
          <div className="upload-container" onClick={() => document.getElementById("fileInput").click()}>
  {image ? (
    <img  
      src={image.startsWith("blob") ? image : `${process.env.REACT_APP_BASE_URL}/${image}`}  
      className="uploaded-image"   loading="lazy"   
    />
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
       <Button variant="danger" onClick={handleSave} disabled={loading}>
  {loading ? (
    <Spinner animation="border" role="status" style={{ width: "1rem", height: "1rem" }} />
  ) : (
    "Save"
  )}
</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditEventModal;
