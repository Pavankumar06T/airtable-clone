import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
    }}>
      <h1>Welcome to Dashboard</h1>
      <p>You are logged in!</p>
      <Link to="/create">
        <button style={{ marginTop: "20px", padding: "10px 20px" }}>Go to Create Table</button>
      </Link>
    </div>
  );
};

export default Dashboard;