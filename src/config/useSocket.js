import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../slices/notificationSlice';

const socket = io('https://nityambackend.onrender.com/api/v1');

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