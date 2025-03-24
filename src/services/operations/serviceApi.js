import { apiConnector } from '../apiConnector';
import { serviceEndpoints } from '../apis';
import toast from 'react-hot-toast';
import { setLoading, setServiceData, setUserServices,setCommunities} from '../../slices/serviceSlice';

export const getServices = async (token, dispatch) => {
  toast.dismiss();
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
  toast.dismiss();
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
