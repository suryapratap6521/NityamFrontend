import { SetSignUpData, setLoading, setToken } from "../../slices/authSlice";
import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { endpoints, postEndpoints } from "../apis";
import setToast from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import axios from "axios";
import Cookies from 'js-cookie'


// Send OTP API
export async function sendotp(phoneNumber, dispatch) {
    const toastid = toast.loading("Loading");
    dispatch(setLoading(true));
    
    try {
      const response = await apiConnector("POST", endpoints.SENDOTP_API, {
        phoneNumber,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("OTP sent successfully to your phone number");
      dispatch(setLoading(false));
      toast.dismiss(toastid);
      return response;
     
    } catch (error) {
      console.log("Send OTP error", error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastid);
}

// Sign Up API
export function signUp(
  firstName, lastName, email, password, confirmPassword, phoneNumber, otp, navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector('POST', endpoints.SIGNUP_API, {
        firstName, lastName, email, password, confirmPassword, phoneNumber, otp
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup successful");

      dispatch(setToken(response.data.token));
      const userImage = response?.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
        
      Cookies.set("token", JSON.stringify(response.data.token), { expires: 1 });
      Cookies.set("user", JSON.stringify(response.data.user), { expires: 1 });
      
      // Update the signup slice data
      dispatch(SetSignUpData({
        token: response.data.token,
        user: { ...(response.data.user), image: userImage }
      }));

      navigate('/profiledetails');
    } catch (error) {
      console.log(error);
      toast.error("Could not signup");
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// Profile Details API
export async function profileDetails(formData, token, navigate, dispatch) {
    const toastId = toast.loading("Loading");
    try {
      const response = await apiConnector('PUT', endpoints.PROFILE_DETAILS, formData, {
        Authorization: `Bearer ${token}`,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Profile details added successfully");

      // Update signup data after profile details update
      dispatch(SetSignUpData({
        profileDetails: formData // You can add additional data as per your requirement
      }));

      navigate('/communityaddress');
    } catch (error) {
      console.log(error);
      toast.error("Could not add the profile details");
      navigate("/profiledetails");
    }
    toast.dismiss(toastId);
}

// Community Address API
export async function communityAddress(formData, token, navigate, dispatch) {
    const toastId = toast.loading("Loading");
    try {
      const response = await apiConnector('PUT', endpoints.COMMUNITY_ADDRESS, formData, {
        Authorization: `Bearer ${token}`,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Community address added successfully");

      // Update signup data after community address update
      dispatch(SetSignUpData({
        formData
      }));
      
      navigate('/community');
    } catch (error) {
      console.log(error);
      toast.error("Could not add the community address");
      navigate("/communityaddress");
    }
    toast.dismiss(toastId);
}


export async function community(formData, token, navigate, dispatch) {
  const toastId = toast.loading("Loading");
  try {
    const response = await apiConnector('PUT', endpoints.COMMUNITY, formData, {
      Authorization: `Bearer ${token}`,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Community added successfully");

    // Update signup data after community address update
    dispatch(SetSignUpData({
      formData
    }));
    
    navigate('/verification');
  } catch (error) {
    console.log(error);
    toast.error("Could not add the community");
    navigate("/community");
  }
  toast.dismiss(toastId);
}

export async function verification(formData, token, navigate, dispatch) {
  const toastId = toast.loading("Loading");
  try {
    const response = await apiConnector('PUT', endpoints.VERIFICATION, formData, {
      Authorization: `Bearer ${token}`,
    });
    if (response.data.success) {
      toast.success("Verification completed successfully!");
      navigate("/profession");  // or navigate to the next step
    } else {
      throw new Error(response.data.message);
    }

    
    navigate('/profession');
  } catch (error) {
    console.error("Verification error:", error);
    toast.error(error.response?.data?.message || "Verification failed. Please try again.");
    navigate("/verification");
  }
  toast.dismiss(toastId);
}


// Submit profession API function
export async function profession(professionData, token, navigate, dispatch) {
  const toastId = toast.loading("Submitting Profession...");
  try {
    const response = await apiConnector('PUT', endpoints.PROFESSION, professionData, {
      Authorization: `Bearer ${token}`,
    });
    
    if (response?.data?.success) {
      toast.success("Profession added successfully!");
      navigate("/dashboard");  
    } else {
      throw new Error(response.data.message);
    }

  } catch (error) {
    console.error("profession error:", error);
    toast.error(error.response?.data?.message || "Failed to add profession. Please try again.");
  } finally {
    toast.dismiss(toastId);
  }
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
      Cookies.set("token", JSON.stringify(response.data.token), { expires: 1});
      console.log(response.data,"----------user from login")
      // localStorage.setItem("user", JSON.stringify(response.data.user));
      Cookies.set("user", JSON.stringify(response.data.user), { expires: 1 });
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

