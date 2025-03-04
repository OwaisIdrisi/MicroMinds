import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const navigate = useNavigate();

  if (!user) {
    return <p>Loading...</p>;
  }

  console.log(user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-xl flex items-center justify-center flex-col gap-1.5">
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        <div className="avatar">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
        </div>
        <div className="mt-4">
          <p className="text-gray-700 text-lg">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-700 text-lg mt-2">
            <strong>Username:</strong> {user.username || "Not Provided"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
