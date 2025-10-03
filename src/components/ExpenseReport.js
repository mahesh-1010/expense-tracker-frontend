import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ExpenseReport = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const fetchExpenses = async (e) => {
    if (e) {
      e.preventDefault(); // Prevent form submission
    }
    console.log("Fetching expenses for:", { fromDate, toDate, userId });
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!fromDate || !toDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://mahesh1010.pythonanywhere.com/api/expenses/expense-report/?fromDate=${fromDate}&toDate=${toDate}&userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response", response);
      const data = await response.json();
      if (response.status === 200) {
        // Handle successful response
        console.log("Fetched expenses:", data.expenses);
        setExpenses(data.expenses);
        setGrandTotal(data.grandTotal);
        console.log("grandTotal", parseInt(grandTotal));
      } else {
        toast.error(data.message || "Failed to fetch expenses");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Don't fetch on initial load, wait for user to select dates
    setLoading(false);
  }, []);
  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2>Expense Report</h2>
        <p className="text-muted">Here you can view your expenses.</p>
      </div>
      <form className="row g-3 mb-4" onSubmit={fetchExpenses}>
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-calendar-alt"></i>
            </span>
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-calendar-alt"></i>
            </span>
            <input
              type="date"
              name="toDate"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <button type="submit" className="btn btn-primary w-100">
            <i className="fas fa-search me-2"></i>
            Search
          </button>
        </div>
      </form>
      <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Item</th>
            <th scope="col">Cost (₹)</th>
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
                <td>{expense.amount}</td>
              </tr>
            ))
          ) : (
            <>
              <tr>
                <td colSpan="5" className="text-center">
                  <h4 className="text-muted">No expenses found</h4>
                  <p className="text-muted">
                    Start by adding your first expense!
                  </p>
                </td>
              </tr>
            </>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end fw-bold" colSpan="3">
              Grand Total:
            </td>
            <td>{grandTotal}</td>
          </tr>
        </tfoot>
      </table>
      <ToastContainer />
    </div>
  );
};

export default ExpenseReport;
