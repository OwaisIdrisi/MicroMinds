import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { logout as logoutHandler } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { Explore } from "../pages";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token") || null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutUser = async () => {
    try {
      const data = await logout(token);
      if (data.success === false) return;
      dispatch(logoutHandler());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="bg-blue-600 text-white p-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">MicroMind</h1>
      <ul className="flex space-x-4 mt-2 items-center">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:underline  ${isActive ? "text-red-500" : "text-white"}`
            }
          >
            Home
          </NavLink>
        </li>
        {user && (
          <>
            <li>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `hover:underline ${isActive ? "text-red-500" : "text-white"}`
                }
              >
                Explore
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/myBlogs"
                className={({ isActive }) =>
                  `hover:underline ${isActive ? "text-red-500" : "text-white"}`
                }
              >
                My Blogs
              </NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:underline  ${isActive ? "text-red-500" : "text-white"}`
            }
          >
            About
          </NavLink>
        </li>
      </ul>
      {user ? (
        <div className="flex items-center gap-3">
          <Avatar user={user} />
          <button
            className="bg-white px-3 py-1 text-blue-600 rounded-xl cursor-pointer"
            onClick={logoutUser}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link
            to="/login"
            className="bg-white px-3 py-1 text-blue-600 rounded-xl cursor-pointer"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className=" px-3 py-1 text-white border-1 rounded-xl cursor-pointer"
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
