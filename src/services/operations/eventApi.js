import { apiConnector } from "../apiConnector";
import { eventEndpoints } from "../apis";
import toast from "react-hot-toast";
import { setLoading, setEventData, setUserEvents,setCommunities} from '../../slices/eventSlice';

export const createEvent = async (formData,dispatch, token) => {
  toast.dismiss();
  dispatch(setLoading(true));
    try {
      const toastId = toast.loading("Creating event...");
      const response = await apiConnector(
        "POST",
        eventEndpoints.CREATE_PAGE,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response?.data?.success) {
        throw new Error("Could not create event");
      }
      toast.dismiss(toastId);
      // console.log(response.data);
      dispatch(setEventData(response.data.data));
      return response;
    } catch (error) {
      toast.dismiss();
      toast.error("event creation failed");
      throw error;
    }
  
};

export const fetchEventsByUser = async (token, dispatch, isLoading) => {
  toast.dismiss();
  if (isLoading) return;

  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));


  try {
    const response = await apiConnector("GET", eventEndpoints.GET_PAGES, {}, {
      Authorization: `Bearer ${token}`,
    });
    console.log(response.data);
    dispatch(setUserEvents(response.data));
    
    return response.data; // Return the response data
  } catch (error) {
    console.error(error);
    toast.error("Problem in fetching the Events");
    throw error; // Rethrow the error so that it can be caught in the component
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};


export const fetchEventDetails = async (eventId,token, dispatch) => {
  toast.dismiss();
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  let body ={
    eventId: eventId
  }
  try {
      const response = await apiConnector("GET",  eventEndpoints.VIEW_PAGE, body, {
          Authorization: `Bearer ${token}`,
      });
      console.log(response.data);
      dispatch(setEventData(response.data));
      
      return response.data; // Return the response data

  } catch (error) {
      console.error(error);
      toast.error("Problem in fetching the event details");
      throw error; // Rethrow the error so that it can be caught in the component
  } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
  }
}