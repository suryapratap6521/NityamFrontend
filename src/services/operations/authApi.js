import { SetSignUpData, setLoading, setToken } from "../../slices/authSlice";
import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { endpoints, postEndpoints } from "../apis";
import setToast from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import axios from "axios";
import Cookies from 'js-cookie'

// this is for sending otp
export function sendotp(phoneNumber) {
  return async (dispatch) => {
    const toastid = toast.loading("Loading");
    dispatch(setLoading(true));
    
    try {
      const response = await apiConnector("POST", endpoints.SENDOTP_API, {
        phoneNumber,
      });
      console.log("send otp api response", response);
      console.log(response.data.success);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("OTP sent succesfully on your given phone Number");
      
    } catch (error) {
      console.log("Send otp error", error);
      toast.error("Could not send otp");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastid);
  };
}

//  this is for sign up
export function signUp(
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  phoneNumber,
  otp,
  navigate,
  
) {
  console.log("yahan tak sahi h");
  return async (dispatch) => {
    const toastId = toast.loading("Loading");
    dispatch(setLoading(true));
    try {
      console.log("yahan tak sahi h");
      const response = await apiConnector('POST', endpoints.SIGNUP_API, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phoneNumber,
        otp,
        navigate,
      });
      console.log("signup api response", response);
      console.log(response.data.success);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup successful");
      dispatch(setToken(response.data.token));
      const userImage = response?.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      // dispatch(setUser({ ...(await response).data.user, image: userImage }));
      // localStorage.setItem("token", JSON.stringify(response.data.token));
      Cookies.set("token", JSON.stringify(response.data.token), { expires: 3});
      console.log(response.data,"----------user from login")
      // localStorage.setItem("user", JSON.stringify(response.data.user));
      Cookies.set("user", JSON.stringify(response.data.user), { expires: 3 });
      
    } catch (error) {
      console.log(error);
      toast.error("Could not signup");
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}



// this is for login

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", endpoints.LOGIN_API, {
        email,
        password,
      });
      console.log(response);
      if (!response.data.message) {
        throw new Error(response.data.message);
      }
      toast.success("Login successful");
      dispatch(setToken(response.data.token));
      const userImage = response?.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      dispatch(setUser({ ...(await response).data.user, image: userImage }));
      // localStorage.setItem("token", JSON.stringify(response.data.token));
      Cookies.set("token", JSON.stringify(response.data.token), { expires: 3});
      console.log(response.data,"----------user from login")
      // localStorage.setItem("user", JSON.stringify(response.data.user));
      Cookies.set("user", JSON.stringify(response.data.user), { expires: 3 });
      navigate("/dashboard");
    } catch (error) {
      console.log("LOGIN API Error", error);
      toast.error("Login failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return async (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    Cookies.remove("token")
    Cookies.remove("user")
    toast.success("Logged out");
    navigate("/");
  };
}

export function getPasswordResetToken(email, setEmailSent, navigate) {
  return async (dispatch) => {
    const toastId = setLoading("Loading");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        endpoints.RESETPASSTOKEN_API,
        {
          email,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Reset Email sent");
      setEmailSent(true);
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to send email for resetting password");
      toast.error("email is not registered with us");
      navigate('/login');
    }
    dispatch(setLoading(false));
  };
}

export function resetPassword(password, confirmPassword, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", endpoints.RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Password has been reset successfully");
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Unable to reset password");
    }
    dispatch(setLoading(false));
  };
}



export const search = async (token, search) => {
  try {
    const response = await apiConnector("GET", endpoints.SEARCH_USER, null, {
      Authorization: `Bearer ${token}`,

    });
    console.log(response, "search response");
  } catch (error) {
    console.log(error);
  }
}

export function googleDetails(city,state,postalCost,phoneNumber,community,navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading");
    dispatch(setLoading(true));
    try {

      const token=Cookies.get("token");
      const response = await apiConnector("POST", endpoints.GOOGLE_DETAILS, {
        city,state,postalCost,phoneNumber,community
      },{Authorization: `Bearer ${token}`});
      
      if (!response.data.message) {
        throw new Error(response.data.message);
      }
     
      toast.success("Login successful");
      dispatch(setToken(response.data.user.token));
      dispatch(setUser(response.data.user))
     
      const userImage = response?.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      dispatch(setUser({ ...(await response).data.user, image: userImage }));
      localStorage.setItem("token", JSON.stringify(response.data.user.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (error) {
      console.log("Google details API Error", error);
      toast.error("Login failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

