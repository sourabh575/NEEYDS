import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail";
import Navbar from "./components/Navbar";
import Loginbygoogle from "./pages/Loginbygoogle";


function ProtectedRoute({ children, token }) {
  if (!token) {
    return <Navigate to="/login" replace />;
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

    // Same-tab updates (we dispatch this on login/logout)
    window.addEventListener("authchange", syncAuthFromStorage);
    // Cross-tab updates
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
        {/* Home: show feed when logged in, otherwise go to login */}
        <Route
          path="/"
          element={
            isAuthed ? (
              <ProtectedRoute token={auth.token}>
                <Feed />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Auth routes (redirect to home if already logged in) */}
        <Route
          path="/login"
          element={isAuthed ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthed ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        {/* App routes (protected) */}
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isAuthed ? "/feed" : "/login"} replace />} />
        <Route path="/google-login" element={<Loginbygoogle />} />
      </Routes>
    </Router>
  );
}


export default App;

