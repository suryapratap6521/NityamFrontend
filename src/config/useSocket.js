import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addNotification } from '../slices/notificationSlice';

// Create a singleton socket connection
const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  autoConnect: true, // optional
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen for real-time notifications
    socket.on('notification received', (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      socket.off('notification received');
    };
  }, [dispatch]);

  return socket;
};

export default useSocket;
