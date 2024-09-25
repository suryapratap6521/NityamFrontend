import { apiConnector } from '../apiConnector';
import { chatEndpoints } from '../apis';
import toast from 'react-hot-toast';
import { setLoading, setSelectedChat, setChats } from '../../slices/chatSlice';

const accessChat = async (userId, dispatch, token, chats) => {
    const toastId = toast.loading("Loading...");
    
    dispatch(setLoading(true));
    try {
        console.log("waahhhh")
        const response = await apiConnector("POST", chatEndpoints.ACCESS_CHAT, { userId }, {
            Authorization: `Bearer ${token}`,
        });
        const data = response.data;
        console.log(data,"it is access data");
        // Dispatch the setChats action to update the Redux store
        if (Array.isArray(chats) && !chats.find((c) => c._id === data._id)) {
            dispatch(setChats([data, ...chats]));
        }
        
        // Dispatch the setSelectedChat action to update the selected chat in the Redux store
        dispatch(setSelectedChat(data));
    } catch (error) {
        console.log(error);
        toast.error("Error in accessing the chat");
    } finally {
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}



const fetchChats = async (token, dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
        const response = await apiConnector("GET", chatEndpoints.FETCH_CHAT, null, {
            Authorization: `Bearer ${token}`,
        });
        console.log(response.data);
        dispatch(setChats(response.data.chat));
        
        return response.data; // Return the response data

    } catch (error) {
        console.error(error);
        toast.error("Problem in fetching the chats");
        throw error; // Rethrow the error so that it can be caught in the component
    } finally {
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export { accessChat, fetchChats };
