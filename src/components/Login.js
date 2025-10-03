import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login data submitted:", loginData);
    try {
      const response = await fetch(
        "https://mahesh1010.pythonanywhere.com/api/expenses/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        console.log("Login successful:", data);
        toast.success("Login successful!");
        localStorage.setItem("userId", data.user["id"]);
        localStorage.setItem("email", data.user["email"]);
        localStorage.setItem("fullName", data.user["fullName"]);
        navigate("/home");
      } else {
        console.log("Login failed:", data.message);
        toast.error(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      toast.error("An error occurred. Please try again.");
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
        <h2 className="text-primary">
          <i className="fas fa-sign-in-alt me-2"></i> Login
        </h2>
      </div>
      <form
        className="p-4 border rounded shadow"
        style={{ maxWidth: "400px", margin: "0 auto" }}
        onSubmit={handleLogin}
      >
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address:
          </label>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                onChange={handleChange}
                value={loginData.email}
              />
            </span>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                onChange={handleChange}
                value={loginData.password}
              />
            </span>
          </div>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
