import React, { useState } from "react";
import { loginUser } from "../services/authservice";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import Header from "./Header";
import Footer from "./Footer";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid Credentials");
    }
  };

  return (
    <>
    <Header/>
    <Navbar/>
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" className="form-control mb-2" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="form-control mb-2" onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
    <Footer/>
    </>
  );
};

export default Login;
