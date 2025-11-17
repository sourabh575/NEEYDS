import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Feed from "./pages/Feed";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route  path="/profile" element={<Profile/>}></Route>
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/Feed" element={<Feed/>}></Route>

      </Routes>
    </Router>
  )
}

export default App
