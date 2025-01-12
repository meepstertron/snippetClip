import { useState, useEffect } from 'react';
import WebSocketManager from '@/lib/websocketManager';

const useExtension = () => {
  const [connected, setConnected] = useState(false);
  const wsManager = WebSocketManager.getInstance();

  useEffect(() => {
    const handleConnectionChange = (isConnected: boolean) => {
      setConnected(isConnected);
    };

    wsManager.addListener(handleConnectionChange);
    wsManager.connect();

    return () => {
      wsManager.removeListener(handleConnectionChange);
    };
  }, []);

  const insertIntoDocument = (text: string) => {
    wsManager.send({ type: 'insert', text });
  };

  const reconnect = () => {
    wsManager.connect();
  };

  return { connected, insertIntoDocument, reconnect };
};

export default useExtension;