import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { logout as logoutHandler } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { useState } from "react";
import toast from "react-hot-toast";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token") || null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutUser = async () => {
    try {
      const data = await logout(token);
      if (data.success === false) return;
      dispatch(logoutHandler());
      toast.success("Logout successfuly");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-lg fixed left-0 top-0 w-full z-40 px-3 md:px-6">
      <div className="flex items-center justify-between h-16 relative">
        {/* Logo - Left */}
        <div className="flex items-center">
          <Link
            to="/"
            className="text-3xl font-extrabold text-gray-900 tracking-wide"
          >
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
              MicroMinds
            </span>
          </Link>
        </div>

        {/* Nav Links - Center */}
        <div className="hidden md:flex space-x-8 absolute left-1/2 -translate-x-1/2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:underline ${isActive ? "text-red-500" : "text-gray-700"}`
            }
          >
            Home
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `hover:underline ${
                    isActive ? "text-red-500" : "text-gray-700"
                  }`
                }
              >
                Explore
              </NavLink>
              <NavLink
                to="/myBlogs"
                className={({ isActive }) =>
                  `hover:underline ${
                    isActive ? "text-red-500" : "text-gray-700"
                  }`
                }
              >
                My Blogs
              </NavLink>
            </>
          )}

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:underline ${isActive ? "text-red-500" : "text-gray-700"}`
            }
          >
            About
          </NavLink>
        </div>

        {/* Auth Buttons - Right */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile">
                <Avatar user={user} />
              </Link>
              <button
                onClick={logoutUser}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button (still far right on small screens) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {isMenuOpen ? (
              // Close Icon
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger Icon
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white shadow-md transition-all duration-300 ease-in-out"
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md ${
                  isActive ? "text-red-500" : "text-gray-700"
                } hover:bg-gray-100 transition`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/explore"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md ${
                      isActive ? "text-red-500" : "text-gray-700"
                    } hover:bg-gray-100 transition`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explore
                </NavLink>
                <NavLink
                  to="/myBlogs"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md ${
                      isActive ? "text-red-500" : "text-gray-700"
                    } hover:bg-gray-100 transition`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Blogs
                </NavLink>
              </>
            )}

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md ${
                  isActive ? "text-red-500" : "text-gray-700"
                } hover:bg-gray-100 transition`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>

            {user ? (
              <>
                <Avatar user={user} />

                <button
                  onClick={() => {
                    logoutUser();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
