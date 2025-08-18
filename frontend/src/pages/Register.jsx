import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  resetError,
} from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);
  const [avatar, setAvatar] = useState(null);
  const [formDetails, setFormDetails] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch, error]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      console.log(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    console.log(formDetails);
    const formData = new FormData();
    formData.append("fullName", formDetails.fullName);
    formData.append("username", formDetails.username);
    formData.append("email", formDetails.email);
    formData.append("password", formDetails.password);
    formData.append("avatar", avatar);
    console.log(formData);
    try {
      const response = await register(formData);
      console.log(response);
      dispatch(
        loginSuccess({
          user: response.userResponse,
          token: response.data.accessToken,
        })
      );
      setFormDetails({ fullName: "", username: "", email: "", password: "" });
      toast.success("✅ Register successful!");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "❌ Login failed";
      dispatch(loginFailure(message));
      toast.error(message);
      console.log(error);
    }
  };

  const changeHandler = (e) => {
    setFormDetails((prev) => {
      const newObj = { ...prev, [e.target.name]: e.target.value };
      return newObj;
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Create an Account
        </h2>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mt-4">
          <label className="cursor-pointer relative">
            <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Upload</span>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              required
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Username
            </label>
            <input
              onChange={changeHandler}
              required
              type="text"
              name="username"
              placeholder="Choose a username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              onChange={changeHandler}
              required
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Email
            </label>
            <input
              onChange={changeHandler}
              required
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Password
            </label>
            <input
              onChange={changeHandler}
              required
              type="password"
              name="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-md font-semibold hover:opacity-90 transition duration-300">
            {loading ? "Loading..." : " Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
