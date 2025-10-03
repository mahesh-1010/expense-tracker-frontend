import Signup from "./components/Signup";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import AddExpense from "./components/AddExpense";
import ManageExpenses from "./components/ManageExpenses";
import ExpenseReport from "./components/ExpenseReport";
import ChangePassword from "./components/ChangePassword";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/manage-expenses" element={<ManageExpenses />} />
          <Route path="/expense-report" element={<ExpenseReport />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
