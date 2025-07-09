import { Fragment, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

// Socket Functions
import { disconnectSocket, initializeSocketConnection } from './socket/socket.client';

// Importing Stores
import { useSocketStore } from './store/useSocketStore';
import { usePublicRoomStore } from './store/usePublicRoomStore';

// Importing Routes
import IndexPage from './routes/IndexPage';
import PublicRoomPage from './routes/PublicRoomPage';
import NotFoundPage from './routes/NotFoundPage';

export default function App() {

  // States
  const {
    subscribeClientSocketRegister,
    unsubscribeClientSocketRegister
  } = useSocketStore();
  const {
    subscribeClientPublicRoomIdRegister,
    unsubscribeClientPublicRoomIdRegister
  } = usePublicRoomStore();

  useEffect(() => {
    initializeSocketConnection();
    subscribeClientSocketRegister();
    subscribeClientPublicRoomIdRegister();

    return () => {
      unsubscribeClientPublicRoomIdRegister();
      unsubscribeClientSocketRegister();
      disconnectSocket();
    }
  }, []);

  return (
    <Fragment>
      <Routes>
        <Route path='/' element={<IndexPage />} />
        <Route path='/public-room/:roomId' element={<PublicRoomPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Fragment>
  );
};
