import { GoogleLogin } from "@react-oauth/google";
import API from "../api/axios";

const GoogleAuthButton = () => {
  const handleSuccess = async (res) => {
    try {
      const googleToken = res.credential;

      const response = await API.post("/users/google-login", {
        token: googleToken,
      });

      // ✅ SAVE TOKEN
      localStorage.setItem("token", response.data.token);

      // ✅ SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // ✅ TRIGGER AUTH UPDATE
      window.dispatchEvent(new Event("authchange"));

    } catch (error) {
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
