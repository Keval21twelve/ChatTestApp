import { io } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
const SOCKET_CHANNEL = process.env.NEXT_PUBLIC_SOCKET_CHANNEL;

let socket;

const useSocket = () => {
  const [data, setData] = useState(null);
  const [socketId, setSocketId] = useState();

  useEffect(() => {
    if (window) {
      socket = io(SOCKET_URL);
      socket.connect();
      socket.on("connect", () => {
        setSocketId(socket.id);
        console.log("socket connected ", socket.connected);
      });

      socket.on(SOCKET_CHANNEL, (myData) => {
        setData(myData);
        setTimeout(() => setData(null), 100);
      });

      socket.on("disconnect", () => {
        console.log("socket disconnected ", socket.connected);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  const onDispatchSocket = useCallback((data) => {
    socket.connected && socket.emit(SOCKET_CHANNEL, data);
  }, []);

  return [data, onDispatchSocket, socketId];
};

export default useSocket;
