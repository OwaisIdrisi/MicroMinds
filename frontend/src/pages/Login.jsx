import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import {
  loginStart,
  loginFailure,
  loginSuccess,
  resetError,
} from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function Login() {
  // const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch, error]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const data = await login(formData);
      dispatch(
        loginSuccess({
          user: data.data.userResponse,
          token: data.data.accessToken,
        })
      );
      console.log(data);
      setFormData({ email: "", password: "" });
      toast.success("✅ Login successful!");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "❌ Login failed";
      dispatch(loginFailure(message));
      toast.error(message);
    }
  };
  const changeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="py-22 flex items-center justify-center bg-gray-50 px-4 h-screen">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Login to MicroMinds
        </h2>

        <form className="mt-6 space-y-4" onSubmit={submitHandler}>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder={`Enter your Email`}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => changeHandler(e)}
              value={formData.email}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => changeHandler(e)}
              value={formData.password}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-md font-semibold hover:opacity-90 transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
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
