import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RedirectIfAuth = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log(isAuthenticated);
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default RedirectIfAuth;
