import axios from "axios";
import {markAsRead,setNotifications} from "../../slices/notificationSlice";

const API_BASE_URL="https://nityambackend.onrender.com"
export const fetchNotifications = (token) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/notifications/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        sort: '-createdAt',
        limit: 20,
        populate: 'sender,post,chat'
      }
    });
    dispatch(setNotifications(response.data.notifications));
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

export const markNotificationAsRead = (notificationId, token) => async (dispatch) => {
  try {
    await axios.put(`${API_BASE_URL}/api/v1/notifications/notifications/${notificationId}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch(markAsRead(notificationId));
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

export const markAllAsRead = (token) => async (dispatch) => {
  try {
    await axios.put(`${API_BASE_URL}/api/v1/notifications/notifications/mark-all-read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch(markAllAsRead());
  } catch (error) {
    console.error("Error marking all as read:", error);
  }
};