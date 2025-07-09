import {
    Fragment
} from 'react';
import {
    useNavigate
} from 'react-router-dom';

export default function NotFoundPage() {

    // States
    const navigate = useNavigate();

    return (
        <Fragment>
            <section className='w-full min-h-screen flex flex-col px-4 sm:px-10 py-6'>
                <section className='flex-1 flex flex-col justify-center items-center gap-10'>
                    {/* Logo */}
                    <img src="/images/logo.gif" alt="Logo" className='w-[80%] max-w-[320px] sm:max-w-[450px] md:max-w-[630px]' />

                    <div className='w-full max-w-[520px] flex flex-col p-4 rounded-md bg-blue-900/80 gap-4'>
                        <button onClick={() => {
                            navigate("/");
                        }} className='bg-[#25e20c] text-2xl sm:text-4xl py-3 sm:py-4 rounded-md font-bold text-white text-shadow-black'>404!</button>
                    </div>
                </section>
            </section>
        </Fragment>
    );
};
