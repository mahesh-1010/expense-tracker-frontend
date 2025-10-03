import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ManageExpenses = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editExpense, setEditExpense] = useState(null);
  const handleEdit = (expense) => {
    console.log("Editing expense:", expense);
    setEditExpense({
      id: expense.id,
      expenseDate: expense.expenseDate,
      expenseItem: expense.expenseItem,
      amount: expense.amount,
    });
  };
  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        const response = await fetch(
          `https://mahesh1010.pythonanywhere.com/api/expenses/delete-expense/${expenseId}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.status === 202) {
          toast.success("Expense deleted successfully");
          fetchExpenses();
        } else {
          toast.error(data.message || "Failed to delete expense");
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
        toast.error("Failed to delete expense");
      }
    }
  };
  const fetchExpenses = async () => {
    if (!userId) {
      navigate("/login");
    } else {
      try {
        setLoading(true);
        const response = await fetch(
          `https://mahesh1010.pythonanywhere.com/api/expenses/list-expenses/?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.status === 200) {
          // Handle successful response
          console.log("Fetched expenses:", data.expenses);
          setExpenses(data.expenses);
          console.log("expenses", expenses);
        } else {
          toast.error(data.message || "Failed to fetch expenses");
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    }
  };
  const handleChange = (e) => {
    setEditExpense({ ...editExpense, [e.target.name]: e.target.value });
  };
  const handleUpdate = async () => {
    try {
      console.log("Updating expense:", editExpense);
      const response = await fetch(
        `https://mahesh1010.pythonanywhere.com/api/expenses/update-expense/${editExpense.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            expenseDate: editExpense.expenseDate,
            expenseItem: editExpense.expenseItem,
            amount: editExpense.amount,
          }),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        toast.success("Expense updated successfully");
        fetchExpenses();
        setEditExpense(null);
      } else {
        toast.error(data.message || "Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);
  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2>Manage Expenses</h2>
        <p className="text-muted">
          Here you can view, edit, and delete your expenses.
        </p>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Item</th>
            <th scope="col">Cost</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
          ) : expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <tr key={expense.id}>
                <th scope="row">{index + 1}</th>
                <td>{new Date(expense.expenseDate).toLocaleDateString()}</td>
                <td>{expense.expenseItem}</td>
                <td>${expense.amount}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleEdit(expense)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(expense.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                <h4 className="text-muted">No expenses found</h4>
                <p className="text-muted">
                  Start by adding your first expense!
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {editExpense && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fas fa-pen me-2"></i>Edit Expense
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditExpense(null)}
                ></button>
              </div>
              <div className="modal-body">
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
                      name="expenseDate"
                      placeholder="Enter the date"
                      onChange={handleChange}
                      value={editExpense.expenseDate}
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
                      name="expenseItem"
                      onChange={handleChange}
                      value={editExpense.expenseItem}
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
                      value={editExpense.amount}
                      placeholder="Enter amount spen"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setEditExpense(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdate}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ManageExpenses;
