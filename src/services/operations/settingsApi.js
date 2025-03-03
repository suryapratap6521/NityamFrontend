import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { setUser } from "../../slices/profileSlice";
import { profileEndpoints } from '../apis';
import { logout } from "./authApi";
import Cookies from 'js-cookie'

const { UPDATE_PROFILE, UPDATE_PROFILE_PIC, DELETE_ACCOUNT, CHANGE_PASSWORD,GET_USER_DETAIL } = profileEndpoints;

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating profile picture...");
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_PROFILE_PIC,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Merge existing user data with new image
      const currentUser = JSON.parse(Cookies.get("user"));
      const updatedUser = { 
        ...currentUser,
        image: response.data.data.image 
      };

      dispatch(setUser(updatedUser));
      Cookies.set("user", JSON.stringify(updatedUser), { expires: 1 });
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("UPDATE_DISPLAY_PICTURE_ERROR:", error);
      toast.error(error.message || "Failed to update profile picture");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating profile...");
    try {
      // Merge with existing additionalDetails
      const currentUser = JSON.parse(Cookies.get("user"));
      const mergedData = {
        additionalDetails: {
          ...currentUser.additionalDetails,
          ...formData.additionalDetails
        }
      };

      const response = await apiConnector("PUT", UPDATE_PROFILE, mergedData, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Preserve existing fields while updating
      const updatedUser = {
        ...currentUser,
        ...response.data.updatedUserDetails,
        additionalDetails: {
          ...currentUser.additionalDetails,
          ...response.data.updatedUserDetails.additionalDetails
        }
      };

      dispatch(setUser(updatedUser));
      Cookies.set("user", JSON.stringify(updatedUser), { expires: 1 });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("UPDATE_PROFILE_ERROR:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Changing password...");
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD, formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Password changed successfully");
  } catch (error) {
    console.error("CHANGE_PASSWORD_ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to change password");
  } finally {
    toast.dismiss(toastId);
  }
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting profile...");
    try {
      const response = await apiConnector("DELETE", DELETE_ACCOUNT, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Profile deleted successfully");
      dispatch(logout(navigate)); // Logout and navigate to home
    } catch (error) {
      console.error("DELETE_PROFILE_ERROR:", error);
      toast.error("Failed to delete profile");
    } finally {
      toast.dismiss(toastId);
    }
  };
}