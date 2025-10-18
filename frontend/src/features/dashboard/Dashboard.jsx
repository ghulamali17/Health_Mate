import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/ui/Navbar";

function Dashboard() {
  return (
    <div className="flex items-center justify-center">
      <Navbar />
      <div className="text-center">
        <h1 className="my-5 font-bold text-5xl">User Dashboard</h1>
        <Link
          to={"/create"}
          className="bg-primary px-4 py-2 rounded text-white hover:bg-green-700 transition"
        >
          Add +
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
