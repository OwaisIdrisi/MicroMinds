import React from "react";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="hero-section bg-slate-50 py-48 text-center">
      <h1 className="text-2xl mb-6">"User" Welcome to MicroMind</h1>
      <Link
        to="/login"
        className="bg-blue-600 px-3 py-1 text-white rounded cursor-pointer"
      >
        Login
      </Link>
    </div>
  );
};

export default Home;
