import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg fixed left-0 top-0 w-full z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/explore" className="nav-link">
              Explore
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/login" className="nav-btn">
              Login
            </Link>
            <Link to="/register" className="nav-btn-alt">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link to="/" className="mobile-link">
              Home
            </Link>
            <Link to="/explore" className="mobile-link">
              Explore
            </Link>
            <Link to="/about" className="mobile-link">
              About
            </Link>
            <Link to="/login" className="mobile-btn">
              Login
            </Link>
            <Link to="/register" className="mobile-btn-alt">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
