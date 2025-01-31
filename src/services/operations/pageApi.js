import { apiConnector } from "../apiConnector";
import { pageEndpoints } from "../apis";
import toast from "react-hot-toast";
import { setLoading, setPageData, setUserPages,setCommunities} from '../../slices/pageSlice';

export const createPage = async (formData,dispatch, token) => {
  dispatch(setLoading(true));
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
      // console.log(response.data);
      dispatch(setPageData(response.data.data));
      return response;
    } catch (error) {
      toast.dismiss();
      toast.error("page creation failed");
      throw error;
    }
  
};

export const fetchPagesByUser = async (userId, token, dispatch, isLoading) => {
  if (isLoading) return;

  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  let body = {
    userId: userId
  };

  try {
    const response = await apiConnector("GET", pageEndpoints.GET_PAGES, body, {
      Authorization: `Bearer ${token}`,
    });
    console.log(response.data);
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


export const fetchPageDetails = async (pageId,token, dispatch) => {
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  let body ={
    pageId: pageId
  }
  try {
      const response = await apiConnector("GET",  pageEndpoints.VIEW_PAGE, body, {
          Authorization: `Bearer ${token}`,
      });
      console.log(response.data);
      dispatch(setPageData(response.data.data));
      
      return response.data; // Return the response data

  } catch (error) {
      console.error(error);
      toast.error("Problem in fetching the page details");
      throw error; // Rethrow the error so that it can be caught in the component
  } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
  }
}