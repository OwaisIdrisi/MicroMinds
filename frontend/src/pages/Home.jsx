import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../api/auth";
import { setUser } from "../features/authSlice";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log(currentUser);
        dispatch(setUser(currentUser.data.user));
      } catch (error) {
        console.log("user not authenticated ", error);
      }
    };
    if (!user) loadUser();
  }, [user, dispatch]);
  return (
    <div className="hero-section bg-slate-50 py-48 text-center">
      <h1 className="text-2xl mb-6">
        {user && user.fullName.toUpperCase()} Welcome to MicroMind
      </h1>
      {!user && (
        <Link
          to="/login"
          className="bg-blue-600 px-3 py-1 text-white rounded cursor-pointer"
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default Home;
