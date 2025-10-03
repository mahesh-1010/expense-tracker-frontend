import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Please fill in all fields");
      return;
    } else if (oldPassword === newPassword) {
      toast.error("New password must be different from old password");
      return;
    } else {
      try {
        const data = {
          userId: userId,
          oldPassword: oldPassword,
          newPassword: newPassword,
        };
        const response = await fetch(
          "https://mahesh1010.pythonanywhere.com/api/expenses/change-password/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        const resp_data = await response.json();
        if (response.status === 200) {
          localStorage.clear();
          navigate("/login");
          toast.success("Password changed successfully! Please login again");
        } else {
          toast.error(resp_data.message || "Failed to change password");
        }
      } catch (error) {
        toast.error("An error occurred");
      }
    }
  };
  useEffect(() => {
    // Don't fetch on initial load, wait for user to select dates
    if (!userId) {
      navigate("/login");
    }
  }, []);
  const handleChange = async (e) => {
    if (e.target.name === "oldPassword") {
      setOldPassword(e.target.value);
    } else if (e.target.name === "newPassword") {
      setNewPassword(e.target.value);
    }
  };
  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2>
          <i className="fas fa-lock me-2"></i> Change Password
        </h2>
        <p className="text-muted">Update your password</p>
      </div>
      <form
        className="p-4 border rounded shadow"
        style={{ maxWidth: "400px", margin: "0 auto" }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="oldPassword" className="form-label">
            Old Password:
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              className="form-control mb-3"
              id="oldPassword"
              name="oldPassword"
              placeholder="Enter your old password"
              onChange={handleChange}
              value={oldPassword}
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            New Password:
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              className="form-control mb-3"
              id="newPassword"
              name="newPassword"
              placeholder="Enter your new password"
              onChange={handleChange}
              value={newPassword}
              required
            />
          </div>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-lock me-2"></i> Change Password
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
