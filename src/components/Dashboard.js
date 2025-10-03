import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);
const Dashboard = () => {
  const name = localStorage.getItem("fullName");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState({});
  const [manageExpenses, setManageExpenses] = useState([]);
  const fetchExpenses = async () => {
    if (!userId) {
      navigate("/login");
    }

    try {
      const response = await fetch(
        `https://mahesh1010.pythonanywhere.com/api/expenses/get-all-expenses/${userId}/`
      );
      const data = await response.json();
      console.log("data", data);
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchManageExpenses = async () => {
    if (!userId) {
      navigate("/login");
    } else {
      try {
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
          setManageExpenses(data.expenses);
          console.log("manageExpenses", manageExpenses);
        } else {
          console.error(data.message || "Failed to fetch expenses");
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    }
  };

  // Group expenses by item and sum amounts for duplicate items
  const groupedExpenses = manageExpenses.reduce((acc, expense) => {
    const item = expense.expenseItem.toLowerCase();
    const amount = parseFloat(expense.amount);

    if (acc[item]) {
      acc[item] += amount;
    } else {
      acc[item] = amount;
    }
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(groupedExpenses),
    datasets: [
      {
        label: "Expense Distribution",
        data: Object.values(groupedExpenses),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)",
          "rgba(83, 102, 255, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    fetchExpenses();
    fetchManageExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2>Welcome, {name}</h2>
        <p className="text-muted">here's your expense overview.</p>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div
            className="card bg-primary text-white text-center mb-3"
            style={{ height: "150px" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-day me-2"></i>Today's Expense
              </h5>
              <p className="card-text fs-4">₹ {expenses.today || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card bg-success text-white text-center mb-3"
            style={{ height: "150px" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-day me-2"></i> Yesterday's Expense
              </h5>
              <p className="card-text fs-4">₹ {expenses.yesterday || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card bg-warning text-white text-center mb-3"
            style={{ height: "150px" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-day me-2"></i>Last 7 Days
              </h5>
              <p className="card-text fs-4">₹ {expenses.last_7_days || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card bg-warning text-white text-center mb-3"
            style={{ height: "150px" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-day me-2"></i>Last 30 Days
              </h5>
              <p className="card-text fs-4">₹ {expenses.last_30_days || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card bg-danger text-white text-center mb-3"
            style={{ height: "150px" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-day me-2"></i>Current Year
              </h5>
              <p className="card-text fs-4">₹ {expenses.current_year || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card bg-secondary text-white text-center mb-3"
            style={{ height: "150px" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-day me-2"></i>Total Expense
              </h5>
              <p className="card-text fs-4">₹ {expenses.total || 0}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="my-5"
        style={{ height: "400px", width: "400px", margin: "0 auto" }}
      >
        <h4>Expense Distribution</h4>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default Dashboard;
