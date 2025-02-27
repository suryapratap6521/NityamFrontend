// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://nityambackend.onrender.com"; // Use your backend server URL
const socket = io(SOCKET_URL, { transports: ["websocket"] });

export default socket;
