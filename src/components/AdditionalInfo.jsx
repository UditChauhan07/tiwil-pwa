import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import Navbar from "./navbar";
import Footer from "./Footer";
import { Accordion, Button, Card } from "react-bootstrap";
import logo from '../img/letsgo.png'
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import './additionalinfo.css'
const AddInformationForm = () => {
  const navigate=useNavigate();
  const [maritalStatus, setMaritalStatus] = useState("");
  const [wifeDetails, setWifeDetails] = useState({
    fullName: "",
    dob: "",
    anniversaryDate: "",
    image: null,
  });
  const [children, setChildren] = useState([]);
  const [fatherDetails, setFatherDetails] = useState({ fullName: "", dob: "", image: null });
  const [motherDetails, setMotherDetails] = useState({ fullName: "", dob: "", image: null });
  const emailOrphone = localStorage.getItem("user.emailOrphone") || ""; // Handle null case

  const handleMaritalStatusChange = (e) => {
    const status = e.target.value;
    setMaritalStatus(status);

    if (status !== "Married") {
      setWifeDetails({ fullName: "", dob: "", anniversaryDate: "", image: null });
      setChildren([]);
    }
  };

  const handleAddChild = () => {
    setChildren([...children, { fullName: "", dob: "", gender: "", image: null }]);
  };
  const handleremovechild = () => {
    if (children.length > 0) {
      setChildren(children.slice(0, -1)); // Removes the last child
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("emailOrphone", emailOrphone);
    formData.append("maritalStatus", maritalStatus);
    formData.append("fatherDetails", JSON.stringify(fatherDetails));
    formData.append("motherDetails", JSON.stringify(motherDetails));
    formData.append("wifeDetails", JSON.stringify(wifeDetails));

    if (fatherDetails.image) formData.append("fatherImage", fatherDetails.image);
    if (motherDetails.image) formData.append("motherImage", motherDetails.image);
    if (wifeDetails.image) formData.append("wifeImage", wifeDetails.image);
    
    children.forEach((child, index) => {
      formData.append(`childDetails[${index}]`, JSON.stringify(child));
      if (child.image) formData.append(`childImage[${index}]`, child.image);
    });

    try {
      const response = await axios.post("http://localhost:3001/auth/save-family-info", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({

        text: 'Data updated successfully for family',
        showCancelButton: false,
        confirmButtonText: 'Go to Dashboard',
        confirmButtonColor: '#FF3366',
        customClass: {
          popup: 'swal-popup',
          title: 'swal-title',
          confirmButton: 'swal-confirm-btn',
          text: 'swal-text',
        },
        imageUrl: logo, // Optional: Set a custom icon or use the default one
        imageWidth: 80,
        imageHeight: 80,
        imageAlt: 'Data Added',
        padding: '2rem',
        background: '#fff',
      });
      navigate('/home')
      console.log(response.data);
    } catch (error) {
      Swal.fire({title:'Error while adding data'})
      console.error("Error saving family info:", error);
    }
  };

  return (
    <>
     <section className="page-controls">  
      <Header />
      <Navbar />
      <div className="container p-5">
        <h2>Add Information</h2>
        <form onSubmit={handleSave}>
          <Accordion defaultActiveKey="0">
            {/* Father Section */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>Father</Accordion.Header>
              <Accordion.Body>
                <input
                  type="text"
                  value={fatherDetails.fullName}
                  onChange={(e) => setFatherDetails({ ...fatherDetails, fullName: e.target.value })}
                  placeholder="Father's Full Name"
                /><br/><br/>
                <label>Father D.O.B</label><br/>
                <input
                  type="date"
                  value={fatherDetails.dob}
                  onChange={(e) => setFatherDetails({ ...fatherDetails, dob: e.target.value })}
                />
                <br/><br/>
                <label>Upload Picture for father</label><br/>
                <input
                  type="file"
                  onChange={(e) => setFatherDetails({ ...fatherDetails, image: e.target.files[0] })}
                />
              </Accordion.Body>
            </Accordion.Item>

            {/* Mother Section */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>Mother</Accordion.Header>
              <Accordion.Body>
                <input
                  type="text"
                  value={motherDetails.fullName}
                  onChange={(e) => setMotherDetails({ ...motherDetails, fullName: e.target.value })}
                  placeholder="Mother's Full Name"
                /><br/><br/>
                  <label>Mother D.O.B</label><br/>
                <input
                  type="date"
                  value={motherDetails.dob}
                  onChange={(e) => setMotherDetails({ ...motherDetails, dob: e.target.value })}
                /><br/><br/>   
                <label>Upload Picture for Mother</label><br/>
                <input
                  type="file"
                  onChange={(e) => setMotherDetails({ ...motherDetails, image: e.target.files[0] })}
                />
              </Accordion.Body>
            </Accordion.Item>

            {/* Marital Status */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>Marital Status</Accordion.Header>
              <Accordion.Body>
                <select value={maritalStatus} onChange={handleMaritalStatusChange}>
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </Accordion.Body>
            </Accordion.Item>

            {/* Wife Section */}
            {maritalStatus === "Married" && (
              <Accordion.Item eventKey="3">
                <Accordion.Header>Wife</Accordion.Header>
                <Accordion.Body>
                  <input
                    type="text"
                    value={wifeDetails.fullName}
                    onChange={(e) => setWifeDetails({ ...wifeDetails, fullName: e.target.value })}
                    placeholder="Wife's Full Name"
                  /><br/><br/>
                    <label>Wife D.O.B</label><br/>
                  <input
                    type="date"
                    value={wifeDetails.dob}
                    onChange={(e) => setWifeDetails({ ...wifeDetails, dob: e.target.value })}
                  /><br/><br/>
                    <label>Marraige Date</label><br/>
                  <input
                    type="date"
                    value={wifeDetails.anniversaryDate}
                    onChange={(e) => setWifeDetails({ ...wifeDetails, anniversaryDate: e.target.value })}
                  /><br/><br/>   <label>Upload Picture for Wife</label><br/>
                  <input
                    type="file"
                    onChange={(e) => setWifeDetails({ ...wifeDetails, image: e.target.files[0] })}
                  />
                </Accordion.Body>
              </Accordion.Item>
            )}

            {/* Children Section */}
            {maritalStatus === "Married" &&
              children.map((child, index) => (
                <Accordion.Item eventKey={`${index + 4}`} key={index}>
                  <Accordion.Header>Child {index + 1}</Accordion.Header>
                  <Accordion.Body>
                    <input
                      type="text"
                      value={child.fullName}
                      onChange={(e) => {
                        const newChildren = [...children];
                        newChildren[index].fullName = e.target.value;
                        setChildren(newChildren);
                      }}
                      placeholder="Child's Full Name"
                    /><br/><br/>
                      <label>Child{index+1} D.O.B</label><br/>
                    <input
                      type="date"
                      value={child.dob}
                      onChange={(e) => {
                        const newChildren = [...children];
                        newChildren[index].dob = e.target.value;
                        setChildren(newChildren);
                      }}
                    /><br/><br/>
                    <select
                      value={child.gender}
                      onChange={(e) => {
                        const newChildren = [...children];
                        newChildren[index].gender = e.target.value;
                        setChildren(newChildren);
                      }}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select><br/><br/>   <label>Upload Picture for Child</label><br/>
                    <input
                      type="file"
                      onChange={(e) => {
                        const newChildren = [...children];
                        newChildren[index].image = e.target.files[0];
                        setChildren(newChildren);
                      }}
                    />
                  </Accordion.Body>
                </Accordion.Item>
              ))}

            {/* Add Child Button */}
            {maritalStatus === "Married" && (
              <>              <Button variant="primary" type="button"   className="mt-1" onClick={handleAddChild}>
                Add Child
              </Button> 
              {children.length > 0 && ( // Only show Remove button if there is at least one child
          <Button
          className="mt-1" style={{marginLeft:"2px"}}
            variant="danger"
            type="button"
            onClick={handleremovechild}
          >
            Remove Child
          </Button>
              )}
                </>

            )}
          </Accordion>

          {/* Save Button */}
          <Button style={{backgroundColor:"#ff3366"}} type="submit" className="mt-3">
            Save
          </Button>
        </form>
      </div>

      </section>
    </>
  );
};

export default AddInformationForm;
