import { apiConnector } from '../apiConnector';
import { serviceEndpoints } from '../apis';
import toast from 'react-hot-toast';
import { setLoading, setServiceData, setUserServices,setCommunities} from '../../slices/serviceSlice';

export const getServices = async (token, dispatch) => {
  try {
    const toastId = toast.loading("Loading...");
    const response = await apiConnector("GET", serviceEndpoints.GET_SERVICES, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log('service',response.data)
    dispatch(setServiceData(response.data));
    if (!response?.data?.success) {
      throw new Error("Could not fetch services");
    }
    toast.dismiss(toastId);
    return response;
  } catch (error) {
    toast.dismiss();
    toast.error(error.message);
    throw error; 
  }
};

export const createService = async (formData, token) => {
  try {
    const toastId = toast.loading("Creating service...");
    const response = await apiConnector("POST", serviceEndpoints.CREATE_SERVICE, formData, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not create service");
    }
    toast.dismiss(toastId);
    return response;
  } catch (error) {
    toast.dismiss();
    toast.error("Service creation failed");
    throw error; 
  }
};


export const getServiceById = async (serviceId, token, dispatch) => {
  toast.dismiss();
  const toastId = toast.loading("Loading service details...");
  dispatch(setLoading(true)); // assuming your serviceSlice uses setLoading
  try {
    // The endpoint is like: BASE_URL/services/service/:id, so we append the serviceId to the URL
    const url = serviceEndpoints.GET_SERVICE_BY_ID.replace(':id', serviceId);
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log(response.data);
    dispatch(setServiceData(response.data));
    toast.dismiss(toastId);
    return response;
  } catch (error) {
    console.error(error);
    toast.error("Problem in fetching the service details");
    throw error;
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};