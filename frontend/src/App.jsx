import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./api/auth";
import { setUser } from "./features/authSlice";
import { About, Explore, Home, Login, Signup, Blog } from "./pages";
import { Navbar, ProtectedRoute, RedirectIfAuth } from "./components";

const App = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const hasFetchedUser = useRef(false);

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

    if (!user && token && !hasFetchedUser) {
      loadUser();
      hasFetchedUser.current = true;
    }
  }, [dispatch, token, user]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <RedirectIfAuth>
                <Login />
              </RedirectIfAuth>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectIfAuth>
                <Signup />
              </RedirectIfAuth>
            }
          />
          <Route path="/about" element={<About />} />

          {/* Protected Routes */}
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <ProtectedRoute>
                <Blog />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
