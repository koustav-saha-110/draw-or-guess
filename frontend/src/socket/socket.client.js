import io from "socket.io-client";

let BACKEND_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";
let socket = null;

export const initializeSocketConnection = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }

    socket = io(BACKEND_URL, {
        transports: ["websocket"],
        withCredentials: true
    });
};

export const getSocket = () => {
    if (!socket) {
        throw new Error("Socket not Initialized!");
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
