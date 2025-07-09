import {
    create
} from "zustand";
import {
    getSocket
} from "../socket/socket.client";

export const useSocketStore = create((set) => ({
    socketId: null,
    username: null,

    setUsername: (username) => {
        set({ username: username });
    },

    subscribeClientSocketRegister: () => {
        try {
            const socket = getSocket();
            socket.on("client:socketId:register", (socketId) => {
                set({ socketId: socketId });
            });
        } catch (error) {
            console.error(error.message);
        }
    },
    unsubscribeClientSocketRegister: () => {
        try {
            const socket = getSocket();
            socket.off("client:socketId:register");
        } catch (error) {
            console.error(error.message);
        }
    },
}));
