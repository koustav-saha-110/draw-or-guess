import {
    Server
} from "socket.io";
import {
    corsOptions
} from "../app.js";
import {
    publicRoom,
    publicRoomCode
} from "../data/rooms.js";
import {
    getRandomWords
} from "../data/words.js";

export const initializeIOServerConnection = (httpServer) => {
    /**
     * Initialising the SOCKETIO Server
     * Here we have to use http server
     * that is basically comming from the file app.js
     * Without HTTP Server We cannot initialise the socketIO Server
     * Also passed some extra options that is corsOptions
     * that is also coming from app.js file
     */
    let io = new Server(httpServer, {
        cors: corsOptions
    });

    try {
        io.on("connection", (socket) => {
            /**
             * Send (emit) the SocketId value to the Current Socket (player),
             * Immediately after getting connected to the Socket Server
             */
            socket.emit("client:socketId:register", socket.id);

            /**
             * Send (emit) the roomId value of the Public Room to the Current Socket (player),
             * Immediately after getting connected to the Socket Server
             */
            socket.emit("client:publicRoomId:register", publicRoom.roomId);

            /**
             * getPlayerFromPublicRoom function
             * This function returns the player detials of the current Socket (player)
             */
            function getPlayerFromPublicRoom() {
                const player = publicRoom.players.find((player) => player.socketId == socket.id);
                return player ? player : null;
            };

            /**
             * sendPublicRoomMessage function
             * This function will send message to all the players those who are in the Public Room
             * it will take (eventType, username, message) as an argument
             * and then send the message to all the Sockets (players) present in the Public Room
             */
            function sendPublicRoomMessage(eventType, username, message) {
                io.to(publicRoom.roomId).emit("new:message", {
                    eventType: eventType,
                    username: username || "Unknown",
                    message: message
                });
            };

            /**
             * sendUpdatePublicRoomDetails function
             * This function will Send (emit) to the values of the Public Room
             * to all the Socket (players) those who are in the Public Room
             * to update their informations of the total game
             */
            function sendUpdatePublicRoomDetails() {
                io.to(publicRoom.roomId).emit("publicRoom:update_details", {
                    publicRoom: {
                        roomId: publicRoom.roomId,
                        players: publicRoom.players,
                        gameState: {
                            isPlaying: publicRoom.gameState.isPlaying,
                            gameStarted: publicRoom.gameState.gameStarted,
                            currentWord: publicRoom.gameState.currentWord,
                            currentDrawer: publicRoom.gameState.currentDrawer,
                            drawerSelectionTimer: publicRoom.gameState.drawerSelectionTimer,
                            playersGuessingTimer: publicRoom.gameState.playersGuessingTimer,
                            previousDrawer: publicRoom.gameState.previousDrawer,
                        },
                    }
                });
            };

            /**
             * getRandomPublicRoomPlayer function
             * This will return a random player data from the Public Room
             * This will be used to select the current drawer of the Public Room Game
             */
            function getRandomPublicRoomPlayer() {
                if (publicRoom.gameState.previousDrawer) {
                    const filteredPlayers = publicRoom.players.filter((player) => player.socketId !== publicRoom.gameState.previousDrawer);
                    const player = filteredPlayers[Math.floor(Math.random() * filteredPlayers.length)];
                    return player;
                }

                const player = publicRoom.players[Math.floor(Math.random() * publicRoom.players.length)];
                return player;
            };

            /**
             * startPublicRoomGame function
             * This function will start the game of the Public Room if not started yet
             * and if it is already started it will return from the function
             * If the Players length of the Public Room is not >= 2 then it will not start the game
             * it will send a message to wait for the other users to join the Public Room
             * and if all the conditions matches then it will start a new game for the Public Room
             */
            function startPublicRoomGame() {
                if (publicRoom.gameState.isPlaying) return;

                if (publicRoom.players.length < 2) {
                    sendPublicRoomMessage("leave", "System", "not enough player to start the game!");
                    sendPublicRoomMessage("leave", "System", "wait for other players to join!");
                    return;
                }

                publicRoom.gameState.isPlaying = true;
                publicRoom.gameState.gameStarted = false;
                publicRoom.gameState.currentWord = null;
                publicRoom.gameState.currentDrawer = null;
                publicRoom.gameState.drawerSelectionTimer = 20;
                publicRoom.gameState.playersGuessingTimer = 60;
                publicRoom.gameState.intervalTimer = null;
                publicRoom.gameState.guessedPlayers = [];

                const words = getRandomWords();
                const player = getRandomPublicRoomPlayer();

                if (!player) {
                    sendPublicRoomMessage("leave", "System", "could not select the drawer!");
                    return;
                }

                publicRoom.gameState.currentDrawer = player?.socketId;
                sendUpdatePublicRoomDetails();
                sendPublicRoomMessage("draw", player?.username || "Unknown", "will draw now!");

                io.to(player?.socketId).emit("drawer:words", {
                    words: words
                });

                if (publicRoom.gameState.intervalTimer) {
                    clearInterval(publicRoom.gameState.intervalTimer);
                    publicRoom.gameState.intervalTimer = null;
                    sendUpdatePublicRoomDetails();
                }

                publicRoom.gameState.intervalTimer = setInterval(() => {
                    publicRoom.gameState.drawerSelectionTimer -= 1;
                    sendUpdatePublicRoomDetails();

                    if (publicRoom.gameState.drawerSelectionTimer <= 0) {
                        clearInterval(publicRoom.gameState.intervalTimer);
                        publicRoom.gameState.intervalTimer = null;
                        publicRoom.gameState.isPlaying = false;
                        sendUpdatePublicRoomDetails();
                        startPublicRoomGame();
                    }
                }, 1000);
            };

            /**
             * updatePublicRoomPlayersScores function
             * This function runs after the player guessing timer ends of the Public Room
             * To update the scores, of who guessed the right word and the score of current drawer
             */
            function updatePublicRoomPlayersScores(drawerPoints, playerPoints) {
                publicRoom.players = publicRoom.players.map((player) => {
                    if (player.socketId == publicRoom.gameState.currentDrawer) {
                        player.score += drawerPoints;
                    }

                    if (publicRoom.gameState.guessedPlayers.includes(player.socketId)) {
                        player.score += playerPoints;
                    }

                    return player;
                });
            };

            /**
             * endPublicRoomGame function
             * This function runs when the player guessing timer timer ends of the Public Room
             * Or all the Players guessed the right word and the current drawer
             * Then it updates the gameState and sends it back to the client or the frontend to update the state there also
             */
            function endPublicRoomGame() {
                if (publicRoom.gameState.intervalTimer) {
                    clearInterval(publicRoom.gameState.intervalTimer);
                    publicRoom.gameState.intervalTimer = null;
                }

                if (publicRoom.gameState.guessedPlayers.length == (publicRoom.players.length - 1)) {
                    updatePublicRoomPlayersScores(50, 75);
                } else {
                    updatePublicRoomPlayersScores(25, 75);
                }

                publicRoom.players.sort((a, b) => b.score - a.score);
                publicRoom.players.forEach((player, idx) => {
                    player.position = idx + 1;
                });

                sendPublicRoomMessage("join", "System", `the word was ${publicRoom.gameState.currentWord}`);
                sendPublicRoomMessage("join", "System", "all players score updated!");

                publicRoom.gameState.isPlaying = false;
                publicRoom.gameState.gameStarted = false;
                publicRoom.gameState.currentWord = null;
                publicRoom.gameState.currentDrawer = null;
                publicRoom.gameState.drawerSelectionTimer = 20;
                publicRoom.gameState.playersGuessingTimer = 60;
                publicRoom.gameState.intervalTimer = null;
                publicRoom.gameState.guessedPlayers = [];
                sendUpdatePublicRoomDetails();

                startPublicRoomGame();
            };

            /**
             * Joining the Socket (player) to the Public Room
             * When a Player clicks on the Play! button
             * After Navigating to the PublicRoomPage
             * Then this Event will be triggered ("join:public:room")
             */
            socket.on("join:public:room", ({ username }) => {
                publicRoom.players.push({
                    socketId: socket.id,
                    username: username || "Unknown",
                    score: 0,
                    position: publicRoom.players.length + 1
                });

                // Joining the Socket to the Public Room Id
                socket.join(publicRoom?.roomId || publicRoomCode);

                /**
                 * A New Player (user) is added to Public Room
                 * All Users should get their informations updated
                 * Also a Joining Messege should be emmited to all the Players (users) those who are in the Public Room only
                 */
                sendUpdatePublicRoomDetails();
                socket.emit("public:room:joined");
                sendPublicRoomMessage("join", username || "Unknown", "joined the room!");

                /**
                 * Checking the Public Room game is started or not
                 * if the game is not started yet in the Public Room
                 * As the new user has joined Emit the StartPublicRoomGame funtion
                 * By Checking the isPlaying value of the PublicRoom gameState Object
                 */
                if (!publicRoom.gameState.isPlaying) {
                    startPublicRoomGame();
                }
            });

            /**
             * Listenes to the Public Room Sockets (players) Messages
             * When a message is being sent by a player, the message will be checked by converting it to the lower case
             * that if the message == current word
             * It will update the guessedPlayer state and
             * then it will send a message with a different event "join" to change the color of the message
             */
            socket.on("public:room:message", ({ message, username }) => {
                if (publicRoom.gameState.gameStarted && publicRoom.gameState.currentWord) {
                    if (message.toLowerCase() == publicRoom.gameState.currentWord.toLowerCase()) {
                        if (!publicRoom.gameState.guessedPlayers.includes(socket.id)) {
                            publicRoom.gameState.guessedPlayers.push(socket.id);
                            socket.emit("right:guess");
                            sendPublicRoomMessage("join", "System", `${username} guessed the word!`);
                        }
                    } else {
                        sendPublicRoomMessage("normal", username, message);
                    }

                    return;
                }

                sendPublicRoomMessage("normal", username, message);
            });

            /**
             * Listening to the Socket (player) Event
             * if the Socket selects a word then this event will run
             * it will start the guessing game from here!
             */
            socket.on("drawer:word-selected", ({ word, username }) => {
                clearInterval(publicRoom.gameState.intervalTimer);
                publicRoom.gameState.gameStarted = true;
                publicRoom.gameState.currentWord = word;
                publicRoom.gameState.drawerSelectionTimer = 20;
                publicRoom.gameState.playersGuessingTimer = 60;
                publicRoom.gameState.intervalTimer = null;
                publicRoom.gameState.previousDrawer = socket.id;
                publicRoom.gameState.guessedPlayers = [];
                sendUpdatePublicRoomDetails();
                sendPublicRoomMessage("join", username, "selected the word!");

                io.to(publicRoom.roomId).emit("game:start");
                io.to(publicRoom.roomId).emit("clear:public:room:canvas");

                if (publicRoom.gameState.intervalTimer) {
                    clearInterval(publicRoom.gameState.intervalTimer);
                    publicRoom.gameState.intervalTimer = null;
                    sendUpdatePublicRoomDetails();
                }

                publicRoom.gameState.intervalTimer = setInterval(() => {
                    publicRoom.gameState.playersGuessingTimer -= 1;
                    sendUpdatePublicRoomDetails();

                    if (publicRoom.gameState.playersGuessingTimer <= 0 || publicRoom.gameState.guessedPlayers.length == (publicRoom.players.length - 1)) {
                        clearInterval(publicRoom.gameState.intervalTimer);
                        publicRoom.gameState.intervalTimer = null;
                        publicRoom.gameState.playersGuessingTimer = 60;

                        sendUpdatePublicRoomDetails();
                        endPublicRoomGame();
                    }
                }, 1000);
            });

            /**
             * This event will run when the current drawer is updating the canvas or drawing in the canvas
             * and this canvas data will be sent to the other users who are in the public room
             * So that other players can also see the canvas what actually the current drawer is drawing
             */
            socket.on("public:room:canvas:updated", ({ canvasData }) => {
                socket.broadcast.to(publicRoom.roomId).emit("canvas:updated", {
                    canvasData: canvasData
                });
            });

            /**
             * leavePublicRoom function
             * This function will be called when a player leaves the public room
             */
            function leavePublicRoom(socketId, username) {
                publicRoom.players = publicRoom.players.filter((player) => player.socketId != socketId);
                publicRoom.gameState.guessedPlayers = publicRoom.gameState.guessedPlayers.filter(id => id !== socketId);

                socket.leave(publicRoom?.roomId || publicRoomCode);
                sendPublicRoomMessage("leave", username, "left the room!");

                if (publicRoom.players.length < 2) {
                    clearInterval(publicRoom.gameState.intervalTimer);
                    publicRoom.gameState.intervalTimer = null;

                    publicRoom.gameState.isPlaying = false;
                    publicRoom.gameState.gameStarted = false;
                    publicRoom.gameState.currentDrawer = null;
                    publicRoom.gameState.currentWord = null;
                    publicRoom.gameState.drawerSelectionTimer = 20;
                    publicRoom.gameState.playersGuessingTimer = 60;
                    publicRoom.gameState.guessedPlayers = [];

                    io.to(publicRoom.roomId).emit("clear:public:room:canvas");
                    sendUpdatePublicRoomDetails();
                    sendPublicRoomMessage("leave", "System", "Not enough players. Game has been stopped!");
                    return;
                }

                if ((publicRoom.gameState.gameStarted || publicRoom.gameState.isPlaying) && publicRoom.gameState.currentDrawer == socketId) {
                    sendPublicRoomMessage("leave", "System", "drawer has left the room!");

                    clearInterval(publicRoom.gameState.intervalTimer);
                    publicRoom.gameState.intervalTimer = null;

                    publicRoom.gameState.isPlaying = false;
                    publicRoom.gameState.gameStarted = false;
                    publicRoom.gameState.currentDrawer = null;
                    publicRoom.gameState.currentWord = null;
                    publicRoom.gameState.drawerSelectionTimer = 20;
                    publicRoom.gameState.playersGuessingTimer = 60;
                    publicRoom.gameState.guessedPlayers = [];

                    sendUpdatePublicRoomDetails();
                    startPublicRoomGame();
                } else {
                    sendUpdatePublicRoomDetails();
                }
            };

            /**
             * Listens to the Socket (player)
             * when the game is started
             * the player either likes or dislike the current drawer drawing
             */
            socket.on("likes:drawing", ({ username }) => {
                sendPublicRoomMessage("join", username, 'liked the drawing!');
            });
            socket.on("dislikes:drawing", ({ username }) => {
                sendPublicRoomMessage("leave", username, 'not liked the drawing!');
            });

            /**
             * Leaving or Exiting the Socket (user) from the Public Room
             * When user gets disconnected or leaves the room this event will be triggered
             * This event will leave the socket from the Public Room
             */
            socket.on("leave:public:room", ({ username }) => {
                leavePublicRoom(socket.id, username);
            });

            /**
             * Disconnect the Socket (player) event
             * When a user closes the window or the site
             * This event will be automatically triggered from the client side
             */
            socket.on("disconnect", () => {
                const player = getPlayerFromPublicRoom(socket.id);

                // Checking the Public Room if the Socket is present there or not
                if (player) {
                    leavePublicRoom(player?.socketId, player?.username || "Unknown");
                    return;
                }
            });
        });
    } catch (error) {
        console.error(error.message);
    }
};
