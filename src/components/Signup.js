import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    console.log("cmeda", formData);
    e.preventDefault();
    try {
      console.log("---------------", formData);
      const response = await fetch(
        "https://mahesh1010.pythonanywhere.com/api/expenses/signUp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (response.status === 201) {
        toast.success("Signup successful! Please Login");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const data = await response.json();
        console.log("data", data);
        toast.error(data.message || data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2>
          <i className="fas fa-user-plus me-2"></i> Signup Page
        </h2>
        <p className="text-muted">Create your expense tracker account</p>
      </div>
      <form
        className="p-4 border rounded shadow"
        style={{ maxWidth: "400px", margin: "0 auto" }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name:
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-user"></i>
            </span>
            <input
              type="text"
              className="form-control mb-3"
              id="name"
              name="fullName"
              placeholder="Enter your full name"
              onChange={handleChange}
              value={formData.fullName}
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address:
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="email"
              className="form-control mb-3"
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              className="form-control mb-3"
              id="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="Enter your password"
              required
            />
          </div>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-user-plus me-2"></i> Signup
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;
