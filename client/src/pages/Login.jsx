import { Link } from "react-router-dom";
import { useState } from "react";
import { login } from "../api";

export default function Login() {
  const [loginType, setLoginType] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    const data = await login(formData);
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Login to MicroMinds
        </h2>

        {/* Toggle between Username & Email */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setLoginType("email")}
            className={`px-4 py-2 rounded-md font-medium ${
              loginType === "email"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setLoginType("username")}
            className={`px-4 py-2 rounded-md font-medium ${
              loginType === "username"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Username
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={loginHandler}>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              {loginType === "email" ? "Email" : "Username"}
            </label>
            <input
              name={loginType}
              type="text"
              placeholder={`Enter your ${loginType}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => onChangeHandler(e)}
              value={formData[loginType] || ""}
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-md font-semibold hover:opacity-90 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
