"use client";

import { createContext } from "react";

import useSocket from "@/hooks/useSocket";
export const SocketContext = createContext({
  socketId: {},
  socketState: {
    type: "",
    payload: "" || {} || [],
  },
  socketDispatch: (data: unknown) => {},
});

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

  const data = { socketState, socketDispatch, socketId };

  return (
    <SocketContext.Provider value={data as any}>
      {children}
    </SocketContext.Provider>
  );
}

export function socketLoginUser(data: unknown) {
  return { type: ACTIONS.LOGIN_USER, payload: data };
}

export function socketSendMessage(data: unknown) {
  return { type: ACTIONS.SEND_MESSAGE, payload: data };
}
