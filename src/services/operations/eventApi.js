import { apiConnector } from "../apiConnector";
import { eventEndpoints } from "../apis";
import toast from "react-hot-toast";
import { setLoading, setEventData, setUserEvents } from '../../slices/eventSlice';

export const createEvent = async (formData, dispatch, token) => {
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
    dispatch(setEventData(response.data.data));
    return response;
  } catch (error) {
    toast.dismiss();
    toast.error("Event creation failed");
    throw error;
  }
};

export const fetchEventsByUser = async (token, dispatch) => {
  toast.dismiss();
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  try {
    const response = await apiConnector("GET", eventEndpoints.GET_PAGES, {}, {
      Authorization: `Bearer ${token}`,
    });
    console.log(response.data);
    dispatch(setUserEvents(response.data));
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error("Problem in fetching the Events");
    throw error;
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};

export const fetchEventDetails = async (eventId, token, dispatch) => {
  toast.dismiss();
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  let body = { eventId: eventId };
  try {
    const response = await apiConnector("GET", eventEndpoints.VIEW_PAGE, body, {
      Authorization: `Bearer ${token}`,
    });
    console.log(response.data);
    dispatch(setEventData(response.data));
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error("Problem in fetching the event details");
    throw error;
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};


export const fetchEventById = async (eventId, token, dispatch) => {
  toast.dismiss();
  const toastId = toast.loading("Loading event details...");
  dispatch(setLoading(true));
  try {
    // Replace the :id placeholder with the actual eventId in the endpoint
    const url = eventEndpoints.VIEW_PAGE.replace(':id', eventId);
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log(response.data);
    dispatch(setEventData(response.data));
    toast.dismiss(toastId);
    return response;
  } catch (error) {
    console.error(error);
    toast.error("Problem in fetching the event details");
    throw error;
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};