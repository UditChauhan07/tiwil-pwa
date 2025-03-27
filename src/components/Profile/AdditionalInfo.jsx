import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Profile/AddInfomation.module.css";
import Swal from "sweetalert2"; // Import SweetAlert2
import axios from "axios";
import '../Profile/additionalinfo.css'
import Loader from '../Loader/Loader'
import { Card, Button, Spinner } from "react-bootstrap";

function AddInformation() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [today, setToday] = useState('');

 
  const [formData, setFormData] = useState({
    father: { name: "", dob: "" },
    mother: { name: "", dob: "" },
    parentAnniversary: { date: "" },
    marriageAnniversary: { date: "" },
    spouse: { name: "", dob: "" },
    hasChildren: false,
    numberOfChildren: 0,
    children: [],
    siblings: [],
    gender: "",
    maritalStatus: "",
    images: {},
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const todayDate = new Date().toISOString().split('T')[0];

    // Set the state with today's date
    setToday(todayDate);
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        console.log("Fetching user data...");
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          console.log("User data fetched:", response.data.data);
          const userData = response.data.data;
          setFormData((prev) => ({
            ...prev,
            gender: userData.gender,
            maritalStatus: userData.maritalStatus,
          }));
        }
      } catch (error) {
        Swal.fire()
        console.error("Failed to fetch user data:", error);
      }finally {
        setLoading(false); 
      }

    };

    fetchUserData();
  }, [token]);

  const handleInputChange = (field, value, type, index = null) => {
    setFormData((prev) => {
      if (index !== null) {
        const updatedArray = [...prev[type]];
        updatedArray[index] = { ...updatedArray[index], [field]: value };
        return { ...prev, [type]: updatedArray };
      }
      return { ...prev, [type]: { ...prev[type], [field]: value } };
    });
  };

  const handleImageChange = (event, fieldName) => {
    const files = event.target.files;
  
    setFormData((prev) => {
      const updatedImages = { ...prev.images };
  
      if (fieldName.includes("Images")) {
        updatedImages[fieldName] = [...(updatedImages[fieldName] || []), ...files];
      } else {
        updatedImages[fieldName] = files[0];
      }
  
      return { ...prev, images: updatedImages };
    });
  };
  
   

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log("Saving family information...");
      const formDataToSend = new FormData();
      const userId = localStorage.getItem("userId");
  
      if (!userId) {
        console.error("User ID is missing. Please login again.");
        return;
      }
  
      const familyMembers = [];
  
      if (formData.father.name || formData.father.dob) {
        familyMembers.push({
          userId,
          fullName: formData.father.name,
          dob: formData.father.dob,
          gender: "Male",
          relationType: "Father",
          eventType: "Birthday",
        });
      }
  
      if (formData.mother.name || formData.mother.dob) {
        familyMembers.push({
          userId,
          fullName: formData.mother.name,
          dob: formData.mother.dob,
          gender: "Female",
          relationType: "Mother",
          eventType: "Birthday",
        });
      }
  
      if (formData.parentAnniversary.date) {
        familyMembers.push({
          userId,
          fullName: "Parent Anniversary",
          dob: formData.parentAnniversary.date,
          relationType: "Parent Anniversary",
          eventType: "Anniversary",
        });
      }
  
      if (formData.marriageAnniversary.date) {
        familyMembers.push({
          userId,
          fullName: "Marriage Anniversary",
          dob: formData.marriageAnniversary.date,
          relationType: "Marriage Anniversary",
          eventType: "Anniversary",
        });
      }
  
      if (formData.spouse.name || formData.spouse.dob) {
        familyMembers.push({
          userId,
          fullName: formData.spouse.name,
          dob: formData.spouse.dob,
          gender: formData.gender === "Male" ? "Female" : "Male",
          relationType: "Spouse",
          eventType: "Birthday",
        });
      }
  
      // **Ensure children get images properly**
      formData.children.forEach((child, index) => {
        if (child.name && child.dob) {
          familyMembers.push({
            userId,
            fullName: child.name,
            dob: child.dob,
            gender: child.gender,
            relationType: "Child",
            eventType: "Birthday",
          });
  
          if (formData.images.childImages && formData.images.childImages[index]) {
            formDataToSend.append("childImages", formData.images.childImages[index]);
          }
        }
      });
  
      // **Ensure siblings get images properly**
      formData.siblings.forEach((sibling, index) => {
        if (sibling.name && sibling.dob) {
          familyMembers.push({
            userId,
            fullName: sibling.name,
            dob: sibling.dob,
            gender: sibling.gender,
            relationType: "Sibling",
            eventType: "Birthday",
          });
  
          if (formData.images.siblingImages && formData.images.siblingImages[index]) {
            formDataToSend.append("siblingImages", formData.images.siblingImages[index]);
          }
        }
      });
  
      const jsonData = {
        familyMembers,
        onboardingStatus: true,
      };
  
      formDataToSend.append("data", JSON.stringify(jsonData));
  
      // **Append parent, spouse, and anniversary images correctly**
      Object.keys(formData.images).forEach((key) => {
        if (!key.includes("Images")) {
          formDataToSend.append(key, formData.images[key]);
        }
      });
  
      console.log("FormData being sent:", formDataToSend);
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }
  
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/family-info`, formDataToSend, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
  
      if (response.data.success) {
        console.log("Family information saved successfully!");
        localStorage.setItem("onboardingStatus", true);
        navigate("/home");
      } else {
        console.error("Error saving family information:", response.data.message);
      }
    } catch (error) {
      console.error("Error saving family information:", error.message);
    }
    finally {
      setLoading(false); // Set loading to false after saving
    }
  };

const handleSkips=()=>{
  navigate('/home')
}

  const handleSkip = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData(); // Create an empty FormData object
  
      // Send the empty FormData (no actual data) with a POST request
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/family-info`,
        formData, // Send the empty FormData
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Let Axios handle the content-type
          },
        }
      );
  
      if (response.data.success) {
        console.log("Family information saved successfully!");
        localStorage.setItem("onboardingStatus", true); // Update onboarding status
        navigate("/home"); // Navigate to home page
      } else {
        console.error("Error saving family information:", response.data.message);
      }
    } catch (error) {
      console.error("Error saving family information:", error.message);
    }
  };
  
  // console.log(parentAnniversary,"44444444444444444444444444")
// console.log(document.getElementById)

  return (
    <>
    <div className={styles.container}>
    <div className={styles.skipps}>
    <button onClick={handleSkip} className={styles.skipButton}>
          Skip
        </button>
    </div>
    
     <div className="d-flex"> 
     <h2>Family Information</h2>
      
        </div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "200px" }}>
        <Spinner animation="border" role="status" style={{ width: "5rem", height: "5rem", }} />
      </div>
      ) : (
        <>
      {/* Father Information */}
      <div className={styles.section}>
        <h3>Father</h3>
        <label>Full Name</label>
        <br/>
        <input
          type="text"
          placeholder="Father's Name"
          value={formData.father.name}
          onChange={(e) => handleInputChange("name", e.target.value, "father")}
        />
         <br/>

        <label>Date of Birth</label> <br/>
        <input
          type="date"
          value={formData.father.dob}
          min="1900-01-01" // Minimum date is fixed to 1900-01-01
          max={today} 
          onChange={(e) => handleInputChange("dob", e.target.value, "father")}
        /><br/>
        <label>Image</label> <br/>
        <input type="file" name="fatherImage" accept="image/*" onChange={(e) => handleImageChange(e, "fatherImage")} />
      </div>
      <br/>
      {/* Mother Information */}
      <div className={styles.section}>
        <h3>Mother</h3>
        <label>Full Name</label> <br/>
        <input
          type="text"
          placeholder="Mother's Name"
          value={formData.mother.name}
          onChange={(e) => handleInputChange("name", e.target.value, "mother")}
        />
 <br/>
        <label>Date of Birth</label> <br/>
        <input
          type="date"
          value={formData.mother.dob}   min="1900-01-01" // Minimum date is fixed to 1900-01-01
          max={today} 
          onChange={(e) => handleInputChange("dob", e.target.value, "mother")}
        />
        <br/>
        <label>Image</label> <br/>
        <input type="file" name="motherImage" accept="image/*" onChange={(e) => handleImageChange(e, "motherImage")} />
      </div>
      <br/>
      {/* Parent Anniversary */}
      <div className={styles.section}>
        <h3>Parent Anniversary</h3> <br/>
        <label>Date</label> <br/>
        <input
          type="date"
          value={formData.parentAnniversary.date}   min="1900-01-01" // Minimum date is fixed to 1900-01-01
          max={today} 
          onChange={(e) => handleInputChange("date", e.target.value, "parentAnniversary")}
        /><br/>
        <label>Image</label> <br/>
        <input type="file" name="parentAnniversaryImage" accept="image/*" onChange={(e) => handleImageChange(e, "parentAnniversaryImage")} />
      </div>
      <br/>
      {/* Spouse Section */}
      {formData.maritalStatus === "Married" && (
        <>
          <div className={styles.section}>
            <h3>{formData.gender === "Male" ? "Wife" : "Husband"}</h3> <br/>
            <label>Full Name</label> <br/>
            <input
              type="text"
              placeholder="Spouse's Name"
              value={formData.spouse.name}
              onChange={(e) => handleInputChange("name", e.target.value, "spouse")}
            /> <br/>

            <label>Date of Birth</label> <br/>
            <input
              type="date"
              value={formData.spouse.dob}   min="1900-01-01" // Minimum date is fixed to 1900-01-01
              max={today} 
              onChange={(e) => handleInputChange("dob", e.target.value, "spouse")}
            />
            <br/>
            <label>Image</label> <br/>
            <input type="file" name="spouseImage" accept="image/*" onChange={(e) => handleImageChange(e, "spouseImage")} />
            </div>

          <div className={styles.section}>
            <h3>Marriage Anniversary</h3> <br/>
            <label>Date</label> <br/>
            <input
              type="date"
              value={formData.marriageAnniversary.date}   min="1900-01-01" // Minimum date is fixed to 1900-01-01
              max={today} 
              onChange={(e) => handleInputChange("date", e.target.value, "marriageAnniversary")}
            /> <br/>
<input type="file" name="marriageAnniversaryImage" accept="image/*" onChange={(e) => handleImageChange(e, "marriageAnniversaryImage")} />
          </div>

          {/* Children Section */}
          <div className={styles.section}>
            <h3>Do you have children?</h3> <br/>
            <select
              value={formData.hasChildren}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hasChildren: e.target.value === "true",
                  numberOfChildren: e.target.value === "true" ? formData.numberOfChildren : 0,
                  children: e.target.value === "true" ? formData.children : [],
                })
              }
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {formData.hasChildren && (
            <>
              <div className={styles.section}>
                <h3>Select Number of Children</h3>
                <select
                  value={formData.numberOfChildren}
                  onChange={(e) => {
                    const count = parseInt(e.target.value, 10) || 0;
                    setFormData({
                      ...formData,
                      numberOfChildren: count,
                      children: Array.from({ length: count }, () => ({ name: "", dob: "", gender: "" })),
                    });
                  }}
                >
                  <option value="0">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              {formData.children.map((child, index) => (
                <div key={index} className={styles.childForm}>
                  <label>Child {index + 1} Name</label>
                  <input
                    type="text"
                    placeholder="Child's Name"
                    value={child.name}
                    onChange={(e) => handleInputChange("name", e.target.value, "children", index)}
                  />

                  <label>Date of Birth</label> <br/>
                  <input
                    type="date"
                    value={child.dob}   min="1900-01-01" // Minimum date is fixed to 1900-01-01
                    max={today} 
                    onChange={(e) => handleInputChange("dob", e.target.value, "children", index)}
                  /><br/>
                  <label>Image</label> <br/>
                
<input type="file" name="childImages" accept="image/*" multiple onChange={(e) => handleImageChange(e, "childImages")} />

                  <label>Gender</label> <br/>
                  <select
                    value={child.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value, "children", index)}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ))}
            </>
          )}
        </>
      )}

      {/* Siblings Section */}
      <div className={styles.section}>
        <h3>Siblings</h3>
        <button
          onClick={() =>
            setFormData({
              ...formData,
              siblings: [...formData.siblings, { name: "", dob: "", gender: "" }],
            })
          }
          className={styles.addButton}
        >
          ➕ Add Sibling
        </button>

        {formData.siblings.map((sibling, index) => (
          <div key={index} className={styles.siblingForm}>
            <label>Sibling's Name</label>
            <input
              type="text"
              placeholder="Sibling's Name"
              value={sibling.name}
              onChange={(e) => handleInputChange("name", e.target.value, "siblings", index)}
            />

            <label>Date of Birth</label>
            <input
              type="date"
              value={sibling.dob}   min="1900-01-01" // Minimum date is fixed to 1900-01-01
              max={today} 
              onChange={(e) => handleInputChange("dob", e.target.value, "siblings", index)}
            />



            <label>Gender</label>
            <select
              value={sibling.gender}
              onChange={(e) => handleInputChange("gender", e.target.value, "siblings", index)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select><br/>
            <label>Image</label>
            <input type="file" name="siblingImages" accept="image/*" multiple onChange={(e) => handleImageChange(e, "siblingImages")} />
            <button
              onClick={() =>
                setFormData({
                  ...formData,
                  siblings: formData.siblings.filter((_, i) => i !== index),
                })
              }
              className={styles.removeButton}
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>
      <div className={styles.saveBtnBox}>
        <button onClick={handleSave} className={styles.saveButton}>
          Save
        </button>
    
      </div>
      </>
    )}
    </div>
    </>
  );
}

export default AddInformation;
