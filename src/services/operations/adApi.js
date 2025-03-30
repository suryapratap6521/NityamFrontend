import { apiConnector } from "../apiConnector";
import { adEndpoints } from "../apis";
import toast from "react-hot-toast";
import { setCommunities, setLoading, setAdData,setAllAds} from '../../slices/adSlice';

export const fetchAllCommunities = async (token,dispatch) => {

    try {
      const response = await apiConnector("GET", adEndpoints.GET_COMMUNITIES, {}, {
        Authorization: `Bearer ${token}`,
      });
      dispatch(setCommunities(response.data));
      
      return response.data; // Return the response data
    } catch (error) {
      console.error(error);
      toast.error("Problem in fetching the Communities");
      throw error; // Rethrow the error so that it can be caught in the component
    } 
  };

  export const createAd = async (formData, dispatch, token) => {
    dispatch(setLoading(true));
    try {
      const toastId = toast.loading("Creating ad...");
      const response = await apiConnector(
        "POST",
        adEndpoints.CREATE_AD,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response?.data?.success) {
        throw new Error("Could not create ad");
      }
      toast.dismiss(toastId);
      // Update adData with returned data if needed.
      dispatch(setAdData(response.data.data));
      return response;
    } catch (error) {
      toast.dismiss();
      toast.error("Page creation failed");
      throw error;
    }
  };
 