import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Wishlist/addtowish.css";
import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";




const Memberform = ({ show, setShow, }) => {
    const userId = localStorage.getItem("user.id");
    console.log(userId); // Retrieve userId from localStorage
    const { eventId } = useParams(); // Retrieve eventId from the route parameters
    console.log(eventId);
    const  emailOrphone=localStorage.getItem("user.emailOrphone")
    // Initialize formData with userId and eventId
    const [othermember, setothermember] = useState({
      userId: userId || "", // Ensure it's not null
      // Ensure it's not null
      fullName: "",
      Relation: "",
      dob: "",
     gender:'',
     emailOrphone:emailOrphone||"",
    });
  
    console.log(othermember);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setothermember((prevData) => ({
        ...prevData,
        [name]: value, // Dynamically update the specific field
      }));
    };
  
    const handleSave = async () => {
      console.log(othermember);
      try {
        console.log('hyy all');
        // Post the formData to the backend
        const response = await axios.post("http://localhost:3001/auth/save-family-info", othermember, {
          headers: { "Content-Type": "multipart/form-data" },
        }); // Adjust API URL
        setShow(false); // Close modal
       
      } catch (error) {
        console.error("Error saving member:", error);
      }
    };
  
    return (
      <Modal show={show} onHide={() => setShow(false)} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>Add Member form</Modal.Title>
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
              <Form.Label className="fw-bold">Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={othermember.fullName}
                onChange={handleInputChange}
                placeholder="Enter The name of member"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Relation</Form.Label>
              <Form.Control
                type="text"
                name="Relation"
                value={othermember.Relation}
                onChange={handleInputChange}
                placeholder="enter the relation to member"
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Date Of Birth</Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  name="dob"
                  value={othermember.dob}
                  onChange={handleInputChange}
                  
                />
               
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Gender</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="gender"
                  value={othermember.gender}
                  onChange={handleInputChange}
                  
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
  
  export default Memberform;
  