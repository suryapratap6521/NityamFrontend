import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../slices/notificationSlice';

const socket = io("http://localhost:8080", {
  transports: ["websocket"],
});

const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
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