// import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("fullName");

  //   useEffect(() => {
  //     if (!name) {
  //       console.log("No name found, redirecting to login");
  //       navigate("/login");
  //     }
  //   }, [name, navigate]);

  return (
    <div className="container text-center mt-5">
      <h1>
        Welcome to <span className="text-primary"> Daily Expense Tracker</span>
      </h1>
      <p className="lead">Track your expenses efficiently</p>
      {name ? (
        <>
          <div className="mt-4">
            <Link to="/dashboard" className="btn btn-warning mx-2">
              <i className="fa-solid fa-gauge-simple-high"></i> Dashboard
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="mt-4">
            <Link to="/" className="btn btn-primary mx-2">
              <i className="fas fa-user-plus"></i> Sign Up
            </Link>
            <Link to="/login" className="btn btn-success mx-2">
              <i className="fas fa-sign-in-alt"></i> Login
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
