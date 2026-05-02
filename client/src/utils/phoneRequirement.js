import API from "../api/axios";

export const ensureMobileNumber = async (navigate) => {
  const res = await API.get("/users/profile");
  const profile = res.data;

  if (profile?.phone?.trim()) {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem(
      "user",
      JSON.stringify({ ...storedUser, phone: profile.phone })
    );
    window.dispatchEvent(new Event("authchange"));
    return true;
  }

  alert("Please add your mobile number before continuing.");
  navigate("/profile");
  return false;
};
