import { io } from "socket.io-client";

// Use environment variable for flexibility (backend URL changes across dev/staging/prod)
const SOCKET_URL =  "http://localhost:8080";

// Initialize socket with safe reconnection settings
export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: false, // We'll call socket.connect() manually after auth
});
