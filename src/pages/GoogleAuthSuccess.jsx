import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { setToken } from "../slices/authSlice";
import { setUser } from "../slices/profileSlice";

export default function GoogleAuthSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = Cookies.get("token");
      const user = Cookies.get("user");

      console.log("Checking cookies...", token, user);

      if (token && user) {
        clearInterval(interval);
        dispatch(setToken(token));
        dispatch(setUser(JSON.parse(user)));

        const userData = JSON.parse(user);

        if (userData.communityDetails || (userData.city && userData.state && userData.postalCost && userData.community)) {
          navigate("/dashboard");
        } else {
          navigate("/profiledetails");
        }
      }
    }, 500); // Check every 0.5 seconds

    // If after 10 seconds still not found, give up
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
      navigate("/login"); // fallback if login cookies not found
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Google Authentication Successful!</h1>
      {loading ? <p className="text-gray-600">Loading user data...</p> : <p className="text-red-500">Failed to load user. Please login again.</p>}
    </div>
  );
}
