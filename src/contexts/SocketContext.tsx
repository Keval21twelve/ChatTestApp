"use client";

import { createContext } from "react";

import useSocket from "@/hooks/useSocket";
export const SocketContext = createContext({});

export const ACTIONS = {
  LOGIN_USER: "login",
  SEND_MESSAGE: "sendMessage",
  ONLINE_USERS: "onlineUsers",
  RECEIVE_MESSAGE: "reciveMessage",
};

export interface IAction {
  type: string;
  payload: any;
}

export default function SocketContextWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socketState, socketDispatch, socketId] = useSocket();

  return (
    <SocketContext.Provider value={{ socketState, socketDispatch, socketId }}>
      {children}
    </SocketContext.Provider>
  );
}

export function socketLoginUser(data: any) {
  return { type: ACTIONS.LOGIN_USER, payload: data };
}

export function socketSendMessage(data: any) {
  return { type: ACTIONS.SEND_MESSAGE, payload: data };
}
