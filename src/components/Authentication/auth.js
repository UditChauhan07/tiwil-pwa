// utils/authStorage.js



// ✅ Set token in localStorage and cookie
export const setAuth = (token) => {
    console.log("jai baba ki")
    console.log(token)

  
    localStorage.setItem("token", token);
  console.log("token",token)
    document.cookie = `token=${token}; path=/; max-age=31536000`; // 1 year
    console.log("token")
  };
  

// ✅ Get token (tries localStorage first, then cookie)
export const getAuth = () => {
  const localToken = localStorage.getItem("token");
  if (localToken) return localToken;

  // fallback from cookie
  const match = document.cookie.match(new RegExp("(^| )" + "token" + "=([^;]+)"));
  const cookieToken = match ? match[2] : null;

  if (cookieToken) {
    // Restore to localStorage if needed
    localStorage.setItem("token", cookieToken);
  }

  return cookieToken;
};

// ✅ Clear both localStorage and cookie
export const clearAuth = () => {
  localStorage.removeItem("token");

  document.cookie = `${"token"}=; path=/; max-age=0`; // expire cookie
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