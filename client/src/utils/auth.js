export function getToken() {
  return localStorage.getItem("token");
}

export function getUserRaw() {
  return localStorage.getItem("user");
}

export function getUserSafe() {
  try {
    const raw = getUserRaw();
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth({ token, user }) {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event("authchange"));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("authchange"));
}

export function logoutToLogin() {
  clearAuth();
  // Hard redirect avoids any stale state causing a blank screen
  window.location.replace("/login");
}


