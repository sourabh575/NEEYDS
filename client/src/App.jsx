import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail";
import UserProfileDetail from "./pages/UserProfileDetail";
import Navbar from "./components/Navbar";
import Loginbygoogle from "./pages/Loginbygoogle";
import LandingPage from "./pages/LandingPage";

function ProtectedRoute({ children, token, redirectTo = "/login" }) {
  if (!token) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          authPrompt: "Please login to continue",
        }}
      />
    );
  }
  return children;
}

function App() {
  const [auth, setAuth] = useState(() => ({
    token: localStorage.getItem("token"),
    user: localStorage.getItem("user"),
  }));

  useEffect(() => {
    const syncAuthFromStorage = () =>
      setAuth({
        token: localStorage.getItem("token"),
        user: localStorage.getItem("user"),
      });

    window.addEventListener("authchange", syncAuthFromStorage);
    window.addEventListener("storage", syncAuthFromStorage);

    return () => {
      window.removeEventListener("authchange", syncAuthFromStorage);
      window.removeEventListener("storage", syncAuthFromStorage);
    };
  }, []);

  const isAuthed = Boolean(auth.token && auth.user);

  return (
    <Router>
      {isAuthed && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            isAuthed ? (
              <ProtectedRoute token={auth.token}>
                <Feed />
              </ProtectedRoute>
            ) : (
              <LandingPage />
            )
          }
        />

        <Route
          path="/login"
          element={isAuthed ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthed ? <Navigate to="/" replace /> : <Register />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute token={auth.token}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute token={auth.token}>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute token={auth.token}>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute token={auth.token}>
              <PostDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute token={auth.token}>
              <UserProfileDetail />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to={isAuthed ? "/feed" : "/"} replace />} />
        <Route path="/google-login" element={<Loginbygoogle />} />
      </Routes>
    </Router>
  );
}

export default App;
