import {
    Fragment,
    useEffect,
    useState
} from 'react';
import {
    getRandomName
} from '../data/names';
import {
    useNavigate
} from 'react-router-dom';

// Importing Store
import {
    useSocketStore
} from '../store/useSocketStore';
import {
    usePublicRoomStore
} from '../store/usePublicRoomStore';

export default function IndexPage() {

    // States
    const { setUsername } = useSocketStore();
    const [name, setName] = useState("");
    const { roomId } = usePublicRoomStore();
    const navigate = useNavigate();

    // Handlers
    const play = () => {
        let result = null;
        if (!name) {
            result = getRandomName();
            setUsername(result);
        } else setUsername(name);

        navigate(`/public-room/${roomId}`);
    };

    useEffect(() => {
        return () => {
            setName("");
        }
    }, []);

    return (
        <Fragment>
            <section className='w-full min-h-screen flex flex-col px-4 sm:px-10 py-6'>
                <section className='flex-1 flex flex-col justify-center items-center gap-10'>
                    {/* Logo */}
                    <img src="/images/logo.gif" alt="Logo" className='w-[80%] max-w-[320px] sm:max-w-[450px] md:max-w-[630px]' />

                    {/* Input + Play Box */}
                    <div className='w-full max-w-[520px] flex flex-col p-4 rounded-md bg-blue-900/80 gap-4'>
                        {/* Name Input */}
                        <div className='flex items-center gap-3'>
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Enter your name' className='bg-white rounded-sm text-base sm:text-xl px-3 py-2 outline-none font-semibold flex-1' />
                            <img src="/images/randomize.gif" onClick={() => setName(getRandomName())} alt="Randomize" className='w-10 sm:w-12 cursor-pointer' />
                        </div>

                        {/* Play Button */}
                        <button onClick={play} className='bg-[#25e20c] text-2xl sm:text-4xl py-3 sm:py-4 rounded-md font-bold text-white text-shadow-black'>Play!</button>
                    </div>
                </section>
            </section>
        </Fragment>
    );
};
