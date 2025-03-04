import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import About from "./pages/About";
import PrivateRoute from "./services/PrivateRoute";
import Profile from "./pages/Profile";

// Latest Blogs	/
// Explore Blogs	/explore
// Single Blog Page	/blog/:id
// Categories	/category/:name
// Create Blog	/create
// About Page	/about

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
