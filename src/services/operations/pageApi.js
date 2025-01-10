import { apiConnector } from "../apiConnector";
import { pageEndpoints } from "../apis";
import { setPageData } from "../../slices/pageSlice";
import toast from "react-hot-toast";

export const createPage = async (formData, token) => {
  return async (dispatch) => {
    try {
      const toastId = toast.loading("Creating page...");
      const response = await apiConnector(
        "POST",
        pageEndpoints.CREATE_PAGE,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response?.data?.success) {
        throw new Error("Could not create page");
      }
      toast.dismiss(toastId);
      console.log(response.data);
      dispatch(setPageData(response.data.data));
      return response;
    } catch (error) {
      toast.dismiss();
      toast.error("page creation failed");
      throw error;
    }
  };
};
