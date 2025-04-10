// utils/authStorage.js

const TOKEN_KEY = "authToken";
const COOKIE_KEY = "authToken";

// ✅ Set token in localStorage and cookie
export const setAuth = (token) => {
  if (!token) return;

  localStorage.setItem(TOKEN_KEY, token);

  document.cookie = `${COOKIE_KEY}=${token}; path=/; max-age=31536000`; // 1 year
};

// ✅ Get token (tries localStorage first, then cookie)
export const getAuth = () => {
  const localToken = localStorage.getItem(TOKEN_KEY);
  if (localToken) return localToken;

  // fallback from cookie
  const match = document.cookie.match(new RegExp("(^| )" + COOKIE_KEY + "=([^;]+)"));
  const cookieToken = match ? match[2] : null;

  if (cookieToken) {
    // Restore to localStorage if needed
    localStorage.setItem(TOKEN_KEY, cookieToken);
  }

  return cookieToken;
};

// ✅ Clear both localStorage and cookie
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);

  document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`; // expire cookie
};
// 🍪 Get value from cookies
export const getCookie = (name) => {
    const cookieArr = document.cookie.split(";");
  
    for (let i = 0; i < cookieArr.length; i++) {
      const cookiePair = cookieArr[i].trim().split("=");
  
      if (cookiePair[0] === name) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
  
    return null;
  };
  
  // ✅ Check & restore token
  export const restoreAuthFromCookie = () => {
    const tokenInLocal = localStorage.getItem("token");
  
    if (!tokenInLocal) {
      const cookieToken = getCookie("token");
      if (cookieToken) {
        localStorage.setItem("token", cookieToken);
        console.log("🔁 Restored token from cookie to localStorage ✅");
      } else {
        console.warn("🚫 No token in cookies or localStorage.");
      }
    }
  };