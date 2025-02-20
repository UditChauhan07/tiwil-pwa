import React, { useState } from "react";
import { registerUser } from "../services/authservice";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Navbar from "./navbar";
import Footer from "./Footer";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    await registerUser({ username, email, password });
    navigate("/login");
  };

  return (
    <>
    <Header/>
    <Navbar/>
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" className="form-control mb-2" onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" className="form-control mb-2" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="form-control mb-2" onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-success w-100">Register</button>
      </form>
    
    </div>
    <Footer/>
    </>
  );
};

export default Register;
