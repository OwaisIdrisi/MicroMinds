import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./api/auth";
import { setUser } from "./features/authSlice";
import { About, Explore, Home, Login, Blog, Register } from "./pages";
import {
  FloatingButton,
  Navbar,
  ProtectedRoute,
  RedirectIfAuth,
} from "./components";
import MyBlogs from "./pages/MyBlogs";

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

    if (!user && token && !hasFetchedUser.current) {
      loadUser();
      hasFetchedUser.current = true;
    }
  }, [dispatch, token, user]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        {user && token && <FloatingButton />}
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectIfAuth>
                <Login />
              </RedirectIfAuth>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuth>
                <Register />
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
            path="/myBlogs"
            element={
              <ProtectedRoute>
                <MyBlogs />
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
