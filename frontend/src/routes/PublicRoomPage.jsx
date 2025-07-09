import {
    Fragment,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    useNavigate,
    useParams
} from 'react-router-dom';
import {
    getSocket
} from '../socket/socket.client';
import {
    Eraser,
    LogOut,
    ThumbsDown,
    ThumbsUp
} from 'lucide-react';

// Importing Store
import {
    usePublicRoomStore
} from '../store/usePublicRoomStore';
import {
    useSocketStore
} from '../store/useSocketStore';

// Static Data
const eventClasses = {
    leave: "text-red-600",
    join: "text-green-600",
    draw: "text-blue-600",
    normal: "text-black",
};

export default function PublicRoomPage() {

    // States
    const navigate = useNavigate();
    const { roomId: publicRoomCode } = useParams();

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const bottomRef = useRef(null);

    const [message, setMessage] = useState("");
    const [lineWidth, setLineWidth] = useState(3);
    const [isDrawing, setIsDrawing] = useState(false);
    const [strokeStyle, setStrokeStyle] = useState("#000000");

    const { socketId, username } = useSocketStore();
    const {
        roomId,
        players,
        isPlaying,
        gameStarted,
        currentWord,
        currentDrawer,
        drawerSelectionTimer,
        playersGuessingTimer,
        messages,
        words,

        subscribePublicRoomUpdateDetails,
        unsubscribePublicRoomUpdateDetails,

        subscribeNewMessage,
        unsubscribeNewMessage,

        subscribeDrawerWords,
        unsubscribeDrawerWords
    } = usePublicRoomStore();

    // Handlers
    const chooseWordHandler = (word) => {
        try {
            const socket = getSocket();
            socket.emit("drawer:word-selected", { word: word, username: username });
        } catch (error) {
            console.error(error.message);
        }
    };
    const startDrawing = ({ nativeEvent }) => {
        if (!currentDrawer) return;
        if (currentDrawer != socketId) return;

        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };
    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };
    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;

        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineWidth = lineWidth;
        contextRef.current.strokeStyle = strokeStyle;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        try {
            const canvasData = getCanvasData();
            const socket = getSocket();
            socket.emit("public:room:canvas:updated", {
                canvasData: canvasData
            });
        } catch (error) {
            console.error(error.message);
        }
    };
    const getCanvasData = () => {
        return canvasRef.current.toDataURL("image/png");
    };
    const setCanvasData = (data) => {
        const img = new Image();
        img.onload = () => {
            const context = canvasRef.current.getContext("2d");
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            context.drawImage(img, 0, 0);
        };
        img.src = data;
    };
    const sendMessage = () => {
        try {
            const socket = getSocket();
            socket.emit("public:room:message", {
                message: message,
                username: username
            });
            setMessage("");
        } catch (error) {
            console.error(error.message);
        }
    };
    const clearCanvas = () => {
        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };
    const likesDrawing = () => {
        try {
            const socket = getSocket();
            socket.emit("likes:drawing", {
                username: username
            });
        } catch (error) {
            console.error(error.message);
        }
    };
    const dislikesDrawing = () => {
        try {
            const socket = getSocket();
            socket.emit("dislikes:drawing", {
                username: username
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    // All useEffects
    /**
     * If Socket (player) not Connected to the Socket Server
     * then it will navigated to the IndexPage
     * and also used the cleanUp function
     * when dismounting the component..
     */
    useEffect(() => {
        try {
            getSocket();
        } catch (error) {
            navigate("/");
        }

        return () => {
            setMessage("");
            setLineWidth(3);
            setIsDrawing(false);
            setStrokeStyle("#000000");
        }
    }, []);

    /**
     * If RoomId is a falsy value
     * then it will navigated to the IndexPage
     */
    useEffect(() => {
        if (!roomId) navigate("/");
    }, []);

    /**
     * Joining the Player to the Public Room
     * using the Socket, it is emitting an event
     * make the player joins the Public Room
     * and also used cleanup a function to emit
     * that the player has leaved the room event
     */
    useEffect(() => {
        try {
            const socket = getSocket();
            socket.emit("join:public:room", { username: username });
        } catch (error) {
            console.error(error.message);
        }

        return () => {
            try {
                const socket = getSocket();
                socket.emit("leave:public:room", { username: username });
            } catch (error) {
                console.error(error.message);
            }
        }
    }, []);

    /**
     * Canvas Element Initialization
     */
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = strokeStyle;
        context.lineWidth = lineWidth;
        contextRef.current = context;
    }, []);

    useEffect(() => {
        subscribePublicRoomUpdateDetails();
        subscribeNewMessage();
        subscribeDrawerWords();

        return () => {
            unsubscribePublicRoomUpdateDetails();
            unsubscribeNewMessage();
            unsubscribeDrawerWords();
        }
    }, []);

    /**
     * Sound Events
     */
    useEffect(() => {
        try {
            const socket = getSocket();
            socket.on("game:start", () => {
                const audio = new Audio("/sounds/game_start.mp3");
                audio.play().catch(error => {
                    console.error(error.message);
                });
            });
            socket.on("public:room:joined", () => {
                const audio = new Audio("/sounds/welcome.mp3");
                audio.play().catch(error => {
                    console.error(error.message);
                });
            });
            socket.on("right:guess", () => {
                const audio = new Audio("/sounds/right_guess.mp3");
                audio.play().catch(error => {
                    console.error(error.message);
                });
            });
        } catch (error) {
            console.error(error.message);
        }

        return () => {
            try {
                const socket = getSocket();
                socket.off("game:start");
                socket.off("public:room:joined");
                socket.off("right:guess");
            } catch (error) {
                console.error(error.message);
            }
        }
    }, []);

    /**
     * Canvas Socket Events
     */
    useEffect(() => {
        try {
            const socket = getSocket();
            socket.on("canvas:updated", ({ canvasData }) => {
                setCanvasData(canvasData);
            });
            socket.on("clear:public:room:canvas", () => {
                clearCanvas();
            });
        } catch (error) {
            console.error(error.message);
        }

        return () => {
            try {
                const socket = getSocket();
                socket.off("canvas:updated");
                socket.off("clear:public:room:canvas");
            } catch (error) {
                console.error(error.message);
            }
        }
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Fragment>
            <section className='h-screen w-full overflow-hidden'>
                <section className="w-full h-full flex flex-col gap-1.5 overflow-y-auto">
                    {/* Header Section */}
                    <header className='rounded-md bg-white w-full h-[10%] flex justify-between px-4 items-center'>

                        {/* Clock */}
                        <div className='relative h-full'>
                            <img src="/images/clock.gif" alt="Clock" className='h-[80%] sm:h-[90%]' />
                            <p className='text-base sm:text-xl md:text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-extrabold'>
                                {isPlaying == false && 0}
                                {
                                    (isPlaying && gameStarted == false) ? (
                                        currentDrawer == socketId ? drawerSelectionTimer : 0
                                    ) : null
                                }
                                {(isPlaying && gameStarted) && playersGuessingTimer}
                            </p>
                        </div>

                        {/* Word */}
                        <div>
                            {
                                (isPlaying == true && gameStarted == true) ? (
                                    currentDrawer == socketId ? <p className='text-2xl font-extrabold text-black'>{currentWord}</p> : (
                                        <p className='text-2xl font-extrabold text-black flex items-center gap-2'>
                                            {
                                                currentWord.split('').map((_, idx) => (
                                                    <span key={idx}>_</span>
                                                ))
                                            }
                                            {`(${currentWord.length})`}
                                        </p>
                                    )
                                ) : <p className='text-center uppercase text-2xl font-bold font-mono'>WAITING</p>
                            }
                        </div>

                        {/* Like & Dislike Drawing */}
                        <div>
                            {
                                (isPlaying == true && gameStarted == true && currentDrawer != socketId) && <div className='flex items-center gap-2.5'>
                                    <ThumbsUp onClick={likesDrawing} className='size-9 text-green-500 hover:size-11 transition-all' />
                                    <ThumbsDown onClick={dislikesDrawing} className='size-9 text-red-500 hover:size-11 transition-all' />
                                </div>
                            }
                            {
                                (isPlaying == false && gameStarted == false) && <div className='flex items-center gap-2.5'>
                                    <LogOut onClick={() => {
                                        navigate("/");
                                    }} className='size-9 text-red-500 hover:size-11 transition-all' />
                                </div>
                            }
                        </div>
                    </header>

                    {/* Canvas & others Section */}
                    <section className='rounded-md bg-white w-full h-[71%]'>
                        {/* Canvas */}
                        <div className='w-full relative border-b border-gray-300 h-[90%]'>
                            <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw} onMouseLeave={finishDrawing} className='w-full absolute h-full bg-white' />
                            {
                                (isPlaying && !gameStarted) && (
                                    currentDrawer && (
                                        currentDrawer == socketId ? (
                                            <div className='absolute w-full h-full bg-black/60 flex flex-col items-center justify-center gap-8'>
                                                <p className='px-20 text-5xl text-center text-white'>Choose one word!</p>
                                                <div className='w-full flex justify-evenly'>
                                                    {
                                                        words && words.map((word, idx) => (
                                                            <button onClick={() => chooseWordHandler(word)} key={idx} className='px-5 py-2 text-white rouned-md border-4 text-xl border-white'>{word}</button>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        ) : <div className='absolute w-full h-full bg-black/60 flex flex-col items-center justify-center'>
                                            <p className='text-white text-center text-5xl px-20'>wait for the drawer to select a word!</p>
                                        </div>
                                    )
                                )
                            }
                            {
                                (isPlaying == false && gameStarted == false) && (
                                    <div className='absolute w-full h-full bg-black/60 flex flex-col items-center justify-center'>
                                        <p className='text-white text-center text-5xl px-20'>game has not started yet..wait for other players to join the room!</p>
                                    </div>
                                )
                            }
                        </div>

                        {/* Implement Stroke Style and Line Width */}
                        <div className='w-full h-[10%] flex flex-wrap items-center gap-3 px-4 sm:px-6 py-2 bg-gray-100'>
                            <div className='flex gap-2 sm:gap-3'>
                                {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#800080'].map((color, idx) => (
                                    <button key={idx} onClick={() => setStrokeStyle(color)} className='w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-gray-300 hover:scale-110 transition-all' style={{ backgroundColor: color }} />
                                ))}
                            </div>
                            <div className='flex items-center gap-1 sm:gap-2'>
                                <label htmlFor='lineWidth' className='text-xs sm:text-sm font-medium'>Line Width:</label>
                                <select id='lineWidth' value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className='border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm'>
                                    {[2, 4, 6, 8, 10, 12, 14].map((width) => (
                                        <option key={width} value={width}>{width}px</option>
                                    ))}
                                </select>
                            </div>
                            <Eraser className='size-6 sm:size-7 text-gray-800 cursor-pointer' onClick={() => {
                                if (currentDrawer == socketId) {
                                    clearCanvas();
                                    return;
                                }
                            }} />
                        </div>
                    </section>

                    {/* Players and Messages Section */}
                    <section className="rounded-md w-full h-[18%] md:h-[11%] flex flex-col md:flex-row gap-1 box-border overflow-hidden">
                        {/* Players Section */}
                        <section className="w-full md:w-1/2 bg-white flex flex-col h-full overflow-y-auto">
                            {
                                players.length > 0 && players.map((player, idx) => (
                                    <div key={idx} className={`w-full h-[109px] flex items-center justify-around px-4 border-b-2 border-gray-300 shrink-0`}>
                                        <div className='flex flex-col items-center w-1/2'>
                                            <p className="font-extrabold text-3xl text-black">#{player.position} {currentDrawer && (currentDrawer == player.socketId && "✏️")}</p>
                                            <p>{player.position == 1 && <img src="/images/owner.gif" alt="1st Position" className='h-8' />}</p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 w-1/2">
                                            <p className="text-center w-full font-medium text-2xl">{player.username}{player.socketId === socketId && <span className="text-green-600 ml-1">(you)</span>}</p>
                                            <p className="text-xl w-full text-center text-gray-600">Score: {player.score}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </section>

                        {/* Messages Section */}
                        <section className="w-full md:w-1/2 rounded-md bg-white flex flex-col h-full overflow-y-auto">
                            <div className="flex flex-col w-full">
                                {
                                    messages.length > 0 && messages.map((msg, idx) => (
                                        <p key={idx} className={`${eventClasses[msg.eventType]} ${idx % 2 == 0 ? "bg-gray-100" : "bg-white"} text-2xl p-2 font-medium border-b-2 border-gray-300 break-words`}><span className="font-bold">{msg.username}:</span> {msg.message}</p>
                                    ))
                                }
                            </div>
                            <div ref={bottomRef}></div>
                        </section>
                    </section>

                    {/* Input Section */}
                    <section className='bg-white w-full h-[8%]'>
                        <input type="text" value={message} onChange={(e) => {
                            if (isPlaying && gameStarted && currentDrawer && currentDrawer != socketId) {
                                setMessage(e.target.value);
                            } else if (isPlaying && !gameStarted) {
                                setMessage(e.target.value);
                            } else if (!isPlaying) {
                                setMessage(e.target.value);
                            }
                        }} onKeyDown={(e) => {
                            if (e.key === "Enter" && message.trim() != "") sendMessage();
                        }} className='w-full h-full text-center text-2xl sm:text-4xl px-2 outline-none' placeholder='Type your guess here...' />
                    </section>
                </section>
            </section>
        </Fragment>
    );
};
