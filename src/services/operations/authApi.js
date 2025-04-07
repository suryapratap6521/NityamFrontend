import { SetSignUpData, setLoading, setToken } from "../../slices/authSlice";
import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { endpoints, postEndpoints } from "../apis";
import setToast from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import axios from "axios";
import Cookies from 'js-cookie'


// Send OTP API
export async function sendotp(phoneNumber, email, dispatch) {
  toast.dismiss();
  const toastid = toast.loading("Loading");
  dispatch(setLoading(true));

  try {
    const response = await apiConnector("POST", endpoints.SENDOTP_API, {
      phoneNumber,
      email,
    });

    if (!response.data.success) {
      // Dismiss toast and show error before throwing
      toast.dismiss(toastid);
      toast.error(response.data.message);
      throw new Error(response.data.message);
    }

    toast.success(response.data.message);
    return response;
  } catch (error) {
    console.log("Send OTP error", error);
    toast.error(error.response?.data?.message || "Failed to send OTP.");
    throw error;
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastid);
  }
}


// Sign Up API
export function signUp(
  firstName, lastName, email, password, confirmPassword, phoneNumber, otp, navigate, setIsLoading
) {
  return async (dispatch) => {
    toast.dismiss();
    const toastId = toast.loading("Loading");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector('POST', endpoints.SIGNUP_API, {
        firstName, lastName, email, password, confirmPassword, phoneNumber, otp
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success(response.data.message);

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
      toast.error(error.response.data.message);
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// Profile Details API
export async function profileDetails(formData, token, navigate, dispatch) {
  toast.dismiss();
    const toastId = toast.loading("Loading");
    try {
      const response = await apiConnector('PUT', endpoints.PROFILE_DETAILS, formData, {
        Authorization: `Bearer ${token}`,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success(response.data.message);

      // Update signup data after profile details update
      dispatch(SetSignUpData({
        profileDetails:formData
      }));
     Cookies.set("user", JSON.stringify(response.data.userDetails), { expires: 1 });
      navigate('/communityaddress');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      navigate("/profiledetails");
    }
    toast.dismiss(toastId);
}

// Community Address API
export async function communityAddress(formData, token, navigate, dispatch) {
  toast.dismiss();
    const toastId = toast.loading("Loading");
    try {
      const response = await apiConnector('PUT', endpoints.COMMUNITY_ADDRESS, formData, {
        Authorization: `Bearer ${token}`,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success(response.data.message);

      // Update signup data after community address update
      dispatch(SetSignUpData({
        communityAddress:formData
      }));
      Cookies.set("user", JSON.stringify(response.data.userDetails), { expires: 1 });
      navigate('/community');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      navigate("/communityaddress");
    }
    toast.dismiss(toastId);
}


export async function community(formData, token, navigate, dispatch) {
  toast.dismiss();
  const toastId = toast.loading("Loading");
  try {
    const response = await apiConnector('PUT', endpoints.COMMUNITY, formData, {
      Authorization: `Bearer ${token}`,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success(response.data.message);

    // Update signup data after community address update
    dispatch(SetSignUpData({
      communityName:formData
    }));
    Cookies.set("user", JSON.stringify(response.data.userDetails), { expires: 1 });
    navigate('/verification');
    
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
    navigate("/community");
  }
  toast.dismiss(toastId);
}

export async function verification(formData, token, navigate, dispatch) {
  toast.dismiss();
  const toastId = toast.loading("Loading");
  console.log(formData,"212312312")
  try {
    const response = await apiConnector('PUT', endpoints.VERIFICATION, formData, {
      Authorization: `Bearer ${token}`,
    });
    if (response.data.success) {
      toast.success(response.data.message);
      dispatch(SetSignUpData({
        verificationDetails:formData
      }));
      Cookies.set("user", JSON.stringify(response.data.user), { expires: 1 });
      navigate("/profession");  // or navigate to the next step
    } else {
      throw new Error(response.data.message);
    }

    
    navigate('/profession');
  } catch (error) {
    console.error("Verification error:", error);
    toast.error(error.response?.data?.message );
    navigate("/verification");
  }
  toast.dismiss(toastId);
}


// Submit profession API function
export async function profession(professionData, token, navigate, dispatch) {
  toast.dismiss();
  const toastId = toast.loading("Submitting Profession...");
  try {
    const response = await apiConnector('PUT', endpoints.PROFESSION, professionData, {
      Authorization: `Bearer ${token}`,
    });
    
    if (response?.data?.success) {
      toast.success("Profession added successfully!");
      dispatch(SetSignUpData({
        professionalDetails:professionData
      }));
      toast.success(response.data.message);
      Cookies.set("user", JSON.stringify(response.data.userDetails), { expires: 1 });
      navigate("/welcome");  
    } else {
      throw new Error(response.data.message);
    }

  } catch (error) {
    console.error("profession error:", error);
    toast.error(error.response?.data?.message);
  } finally {
    toast.dismiss(toastId);
  }
}

// this is for login

export function login(email, password, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    toast.dismiss();
    try {
      await toast.promise(
        (async () => {
          const response = await apiConnector("POST", endpoints.LOGIN_API, {
            email,
            password,
          });
          if (!response.data.message) {
            throw new Error(response.data.message);
          }
          // Success message from the API
          const successMessage = response.data.message;

          // Set token and user in Redux store and cookies
          dispatch(setToken(response.data.token));
          const userImage = response?.data?.user?.image
            ? response.data.user.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
          dispatch(setUser({ ...response.data.user, image: userImage }));
          Cookies.set("token", JSON.stringify(response.data.token), { expires: 1 });
          Cookies.set("user", JSON.stringify(response.data.user), { expires: 1 });
          console.log(Cookies.get("user"), "user data in login api")
          // Navigate to dashboard
          navigate("/dashboard");

          return successMessage;
        })(),
        {
          loading: "Signing in...",
          success: (data) => data, // This will be the success message
          error: (err) =>
            err.response?.data?.message,
        }
      );
    } catch (error) {
      console.error("LOGIN API Error", error);
      // No need to call toast.error here because toast.promise handles it
    }
    dispatch(setLoading(false));
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
    toast.dismiss();
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
      toast.success(response.data.message);
      setEmailSent(true);
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error(error.response.data.message);
      toast.error("email is not registered with us");
      navigate('/login');
    }
    dispatch(setLoading(false));
  };
}

export function resetPassword(password, confirmPassword, token) {

  return async (dispatch) => {
    dispatch(setLoading(true));
    toast.dismiss();
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



