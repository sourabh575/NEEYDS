import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const GoogleAuthButton = () => {
  const navigate = useNavigate();

  const handleSuccess = async (res) => {
    try {
      const response = await API.post("/users/google-login", {
        token: res.credential,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.dispatchEvent(new Event("authchange"));
      navigate("/feed", { replace: true });
    } catch {
      console.log("Google Login Failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Google Login Failed")}
    />
  );
};

export default GoogleAuthButton;
