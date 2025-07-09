import {
    create
} from "zustand";
import {
    getSocket
} from "../socket/socket.client";

export const usePublicRoomStore = create((set) => ({
    roomId: null,
    players: [],
    isPlaying: false,
    gameStarted: false,
    currentWord: null,
    currentDrawer: null,
    drawerSelectionTimer: 20,
    playersGuessingTimer: 60,
    messages: [],
    words: null,

    subscribeClientPublicRoomIdRegister: () => {
        try {
            const socket = getSocket();
            socket.on("client:publicRoomId:register", (roomId) => {
                set({ roomId: roomId });
            });
        } catch (error) {
            console.error(error.message);
        }
    },
    unsubscribeClientPublicRoomIdRegister: () => {
        try {
            const socket = getSocket();
            socket.off("client:publicRoomId:register");
        } catch (error) {
            console.error(error.message);
        }
    },

    subscribePublicRoomUpdateDetails: () => {
        try {
            const socket = getSocket();
            socket.on("publicRoom:update_details", ({ publicRoom }) => {
                set({
                    players: publicRoom.players,
                    isPlaying: publicRoom.gameState.isPlaying,
                    gameStarted: publicRoom.gameState.gameStarted,
                    currentWord: publicRoom.gameState.currentWord,
                    currentDrawer: publicRoom.gameState.currentDrawer,
                    drawerSelectionTimer: publicRoom.gameState.drawerSelectionTimer,
                    playersGuessingTimer: publicRoom.gameState.playersGuessingTimer
                });
            });
        } catch (error) {
            console.error(error.message);
        }
    },
    unsubscribePublicRoomUpdateDetails: () => {
        try {
            const socket = getSocket();
            socket.off("publicRoom:update_details");
        } catch (error) {
            console.error(error.message);
        }
    },

    subscribeNewMessage: () => {
        try {
            const socket = getSocket();
            socket.on("new:message", (message) => {
                const audio = new Audio("/sounds/notification.mp3");
                audio.play().catch((error) => {
                    console.error(error.message);
                });

                set((state) => ({
                    messages: [...state.messages, message],
                }));
            });
        } catch (error) {
            console.error(error.message);
        }
    },
    unsubscribeNewMessage: () => {
        try {
            const socket = getSocket();
            socket.off("new:message");
        } catch (error) {
            console.error(error.message);
        }
    },

    subscribeDrawerWords: () => {
        try {
            const socket = getSocket();
            socket.on("drawer:words", ({ words }) => {
                set({ words: words });
            });
        } catch (error) {
            console.error(error.message);
        }
    },
    unsubscribeDrawerWords: () => {
        try {
            const socket = getSocket();
            socket.off("drawer:words");
        } catch (error) {
            console.error(error.message);
        }
    },
}));
