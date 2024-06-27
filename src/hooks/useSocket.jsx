import { io } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";

const SOCKET_URL = "http://localhost:3001";
const SOCKET_CHANNEL = "";

let socket = io(SOCKET_URL);

const useSocket = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    socket = io(SOCKET_URL);
    socket.connect();
    socket.on("connect", () => {
      console.log("socket connected ", socket.connected);
    });

    socket.on(SOCKET_CHANNEL, (myData) => {
      console.debug(">> socket event ", myData);

      setData(myData);
      setTimeout(() => setData(null), 100);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected ", socket.connected);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onDispatchSocket = useCallback((data) => {
    socket.connected &&
      socket.emit(process.env.NEXT_PUBLIC_SOCKET_CHANNEL, data);
  }, []);

  return [data, onDispatchSocket];
};

export default useSocket;
