import { v4 as uuidv4 } from "uuid";

export const publicRoomCode = `${uuidv4()}`;
export const publicRoom = {
    roomId: publicRoomCode,
    players: [],
    gameState: {
        isPlaying: false,
        gameStarted: false,
        currentWord: null,
        currentDrawer: null,
        drawerSelectionTimer: 20,
        playersGuessingTimer: 60,
        intervalTimer: null,
        previousDrawer: null,
        guessedPlayers: [],
    },
};
