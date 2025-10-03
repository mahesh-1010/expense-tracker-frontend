import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    itemName: "",
    amount: "",
  });
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      console.log("Submitting expense:", { ...formData, userId });
      const response = await fetch(
        `https://mahesh1010.pythonanywhere.com/api/expenses/add-expense/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, userId }),
        }
      );
      const data = await response.json();
      if (response.status === 201) {
        toast.success("Expense added successfully");
        navigate("/add-expense");
        setFormData({
          date: "",
          itemName: "",
          amount: "",
        });
      } else {
        toast.error(data.message || "Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    }
  };
  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2>
          <i className="fas fa-plus-circle me-2"></i> Add Expense
        </h2>
      </div>
      <form
        className="p-4 border rounded shadow"
        style={{ maxWidth: "400px", margin: "0 auto" }}
        onSubmit={handleExpenseSubmit}
      >
        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Expense Date:
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fa-solid fa-calendar-days"></i>
            </span>
            <input
              type="date"
              className="form-control mb-3"
              id="date"
              name="date"
              placeholder="Enter the date"
              onChange={handleChange}
              value={formData.date}
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="item-name" className="form-label">
            Expense Item:
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-shopping-cart"></i>
            </span>
            <input
              type="text"
              className="form-control mb-3"
              id="item-name"
              name="itemName"
              onChange={handleChange}
              value={formData.itemName}
              placeholder="Enter expense item (e.g. Groceries, Petrol)"
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Expense Cost (₹):
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-rupee-sign"></i>
            </span>
            <input
              type="number"
              className="form-control mb-3"
              id="amount"
              name="amount"
              onChange={handleChange}
              value={formData.amount}
              placeholder="Enter amount spen"
              required
            />
          </div>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i> Add Expense
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddExpense;
