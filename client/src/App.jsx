import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail";
import Navbar from "./components/Navbar";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Listen for token changes (when login/register saves token)
  useEffect(() => {
    const handleTokenChange = () => {
      setToken(localStorage.getItem("token"));
    };

    // Listen for custom event dispatched by Login/Register components
    window.addEventListener("tokenUpdated", handleTokenChange);
    
    // Also listen for storage events (from other tabs/windows)
    window.addEventListener("storage", handleTokenChange);

    return () => {
      window.removeEventListener("tokenUpdated", handleTokenChange);
      window.removeEventListener("storage", handleTokenChange);
    };
  }, []);

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        {/* Home: show feed when logged in, otherwise go to login */}
        <Route
          path="/"
          element={
            token ? (
              <ProtectedRoute>
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
          element={token ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/" replace /> : <Register />}
        />

        {/* App routes (protected) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={token ? "/feed" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;

