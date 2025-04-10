import { Modal, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { FaCamera, FaChevronDown, FaCloudUploadAlt } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Wishlist/addtowish.css";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Memberform = ({ show, setShow }) => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    fullName: "",
    relation: "",
    dob: "",
    gender: "",
    image: null,
  });

  const [today, setToday] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const todayDate = new Date().toISOString().split('T')[0];
    setToday(todayDate);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Full Name is required.";
    } else if (!/^[a-zA-Z\s]{1,50}$/.test(formData.fullName)) {
      newErrors.fullName = "Only letters & spaces allowed (max 50 characters).";
    }

    if (!formData.relation) {
      newErrors.relation = "Relation is required.";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required.";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const eventData = formData;
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
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Swal.fire("Success", "Member added successfully", "success");
        setFormData({
          fullName: '',
          relation: '',
          dob: '',
          gender: '',
          image: null,
        });
        setShow(false);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      Swal.fire("Error", "Failed to add member", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Add Member</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="position-relative text-center">
          {formData.image && (
            <img
              src={URL.createObjectURL(formData.image)}
              className="img-fluid rounded wishlist-image"
              alt="Profile"
            />
          )}
          <div className="camera-icon position-absolute">
            <FaCamera size={20} />
          </div>
        </div>

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
            {errors.fullName && <span className="text-danger">{errors.fullName}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Relation</Form.Label>
            <div className="d-flex align-items-center position-relative">
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
              <FaChevronDown size={20} className="position-absolute" style={{ right: '10px', top: '12px' }} />
            </div>
            {errors.relation && <span className="text-danger">{errors.relation}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Date of Birth</Form.Label>
            <InputGroup>
              <Form.Control
                type="date"
                name="dob"
                min="1900-01-01"
                max={today}
                value={formData.dob}
                onChange={handleInputChange}
              />
            </InputGroup>
            {errors.dob && <span className="text-danger">{errors.dob}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Gender</Form.Label>
            <div className="d-flex align-items-center position-relative">
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
              <FaChevronDown size={20} className="position-absolute" style={{ right: '10px', top: '12px' }} />
            </div>
            {errors.gender && <span className="text-danger">{errors.gender}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="upload-container" onClick={() => document.getElementById("fileInput").click()}>
              {formData.image ? (
                <img src={URL.createObjectURL(formData.image)} alt="Preview" className="uploaded-image" />
              ) : (
                <div className="upload-icon">
                  <FaCloudUploadAlt size={50} color="#E11531" />
                  <p>Upload Image</p>
                </div>
              )}
              <input type="file" id="fileInput" accept="image/*" onChange={handleImageUpload} hidden />
            </div>
          </Form.Group>
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

export default Memberform;
