// src/pages/GoogleAuthSuccess.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { setToken } from "../slices/authSlice";
import { setUser } from "../slices/profileSlice";
export default function GoogleAuthSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    console.log(token);
    console.log(user);
    if (token && user) {
      dispatch(setToken((token)));
      dispatch(setUser(JSON.parse(user)));
    }
    console.log(user,"-------user in google");
    const userData = user ? JSON.parse(user) : null;
    if (userData && userData.communityDetails) {
      navigate("/dashboard");
    } else {
      navigate("/profiledetails");
    }
  }, [dispatch, navigate]);

  return <div><h1>Google Authentication Successful!</h1>
      <p>Redirecting or loading user data...</p></div>
}
