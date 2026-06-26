import { io } from "socket.io-client";

let socket;

export function connectSocket(token) {
  if (!token) {
    return null;
  }

  if (!socket) {
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
    const socketUrl = apiBaseUrl.replace(/\/api$/, "");

    socket = io(socketUrl, {
      autoConnect: false,
      auth: { token },
    });
  } else {
    socket.auth = { token };
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
