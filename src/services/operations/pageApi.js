import { apiConnector } from "../apiConnector";
import { pageEndpoints } from "../apis";
import toast from "react-hot-toast";
import { setLoading, setPageData, setUserPages,setCommunities} from '../../slices/pageSlice';

export const createPage = async (formData,dispatch, token) => {
  dispatch(setLoading(true));
  const toastId = toast.loading("Creating page...");
    try {

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
      // console.log(response.data);
      dispatch(setPageData(response.data.data));
      return response;
    } catch (error) {
      toast.dismiss();
      toast.error("page creation failed");
      throw error;
    }finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  
};

export const fetchPagesByUser = async (token, dispatch, isLoading) => {
  if (isLoading) return;

  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));

  try {
    const response = await apiConnector("GET", pageEndpoints.GET_PAGES,null,{
      Authorization: `Bearer ${token}`,
    });
    console.log(response.data,"------>pages data");
    dispatch(setUserPages(response.data.data));
    
    return response.data; // Return the response data
  } catch (error) {
    console.error(error);
    toast.error("Problem in fetching the Pages");
    throw error; // Rethrow the error so that it can be caught in the component
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};


export const fetchPageDetails = async (pageId, token, dispatch) => {
  if (!pageId || !token) return; // Prevent API call if no ID or token

  dispatch(setLoading(true));
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("POST", pageEndpoints.VIEW_PAGE, { pageId }, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) throw new Error("Could not fetch page details");

    dispatch(setPageData(response.data.data)); // Update Redux state
    return response.data;
  } catch (error) {
    console.error("Error fetching page details:", error);
    toast.error("Failed to load page details");
    throw error;
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};

export const deletePage = async (pageId,token) => {
  // if (!pageId || !token) return; // Prevent API call if no ID or token

  // dispatch(setLoading(true));
  const toastId = toast.loading("Deleting Page....");

  try {
    const response = await apiConnector("DELETE", pageEndpoints.DELETE_PAGE, { pageId }, {
      Authorization: `Bearer ${token}`,
    });
    console.log(response)

    // dispatch(setPageData(response.data.data)); // Update Redux state
    return response;
  } catch (error) {
    console.error("Error fetching page details:", error);
    toast.error("Failed to load page details");
    throw error;
  } finally {
    // dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};