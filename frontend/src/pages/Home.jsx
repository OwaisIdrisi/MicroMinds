import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
export const Home = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="hero-section bg-slate-50 py-48 text-center">
      <h1 className="text-2xl mb-6">
        {user && user.fullName.toUpperCase()} Welcome to MicroMind
      </h1>
      {user ? (
        <Link
          to="/explore"
          className="bg-blue-600 px-3 py-2 text-white rounded cursor-pointer"
        >
          Explore
        </Link>
      ) : (
        <Link
          to="/login"
          className="bg-blue-600 px-3 py-2 text-white rounded cursor-pointer"
        >
          Login
        </Link>
      )}
    </div>
  );
};
