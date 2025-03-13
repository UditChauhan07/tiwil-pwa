import React from "react";
import "./Familyinfo.css"; // Import CSS file
import Header from "../Header";
import Navbar from "../navbar";
import Footer from "../Footer";
import { Link } from "react-router-dom";

const familyMembers = [
  {
    role: "WIFE",
    name: "Ayushi",
    dob: "25 July, 1980",
    anniversary: "05 March, 2001",
    image: "wife.jpg",
  },
  {
    role: "CHILD 1",
    name: "Ayushi",
    dob: "25 July, 1980",
    anniversary: "05 March, 2001",
    image: "child1.jpg",
  },
  {
    role: "CHILD 2",
    name: "Ayushi",
    dob: "25 July, 1980",
    anniversary: "05 March, 2001",
    image: "child2.jpg",
  },
  {
    role: "FATHER",
    name: "Ayushi",
    dob: "25 July, 1980",
    anniversary: "05 March, 2001",
    image: "father.jpg",
  },
  {
    role: "MOTHER",
    name: "Ayushi",
    dob: "25 July, 1980",
    anniversary: "05 March, 2001",
    image: "mother.jpg",
  },
];

const FamilyList = () => {
  return (
    <>
    <section className="page-controls">
  
    <Navbar/>
    <div className="containers">
      <h2 className="text-centera mt-3">View Detail</h2>
      {familyMembers.map((member, index) => (
        <div className="family-card" key={index}>
          <div className="headerss">{member.role} <span className="dots">⋮</span></div>
          <div className="bod">
            <img   src={`${process.env.PUBLIC_URL}/img/userimage3.jpg`} alt={member.role} className="profile-pic" />
            <div className="details">
              <p><span>Name:</span> {member.name}</p>
              <p><span>Date of Birth:</span> {member.dob}</p>
              <p><span>Anniversary:</span> {member.anniversary}</p>
            </div>
          </div>
        </div>
      ))}
      <Link to='/home'><button className="go-btn">Let's Go</button></Link>

    </div>
    <Footer/>
    </section>
    </>
  );
};

export default FamilyList;
