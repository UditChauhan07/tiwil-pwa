import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// 🔹 Register User
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

// 🔹 Login User & Store UserId in Local Storage
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.userId) {
    localStorage.setItem("userId", response.data.userId);
  }
  return response.data;
};

// 🔹 Logout User
export const logoutUser = () => {
  localStorage.removeItem("userId");
};
