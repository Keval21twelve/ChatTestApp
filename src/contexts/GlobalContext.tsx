"use client";

import { createContext, useReducer } from "react";
export const GlobalContext = createContext({});

export const ACTIONS = {
  LOGIN_USER: "login.user",
  SEND_MESSAGE: "send.message",
  SAVE_MESSAGES: "save.messages",
  SAVE_ONLINE_USERS: "save.online.users",
};

export interface IUser {
  id: string;
  name: string;
}

export interface IMessage {
  id: string;
  message: string;
  senderId: string;
  reciverId: string;
  timeStamp: number;
}

export interface IState {
  currentUser: IUser;
  isLoggedIn: boolean;
  users: Array<IUser>;
  messages: Array<IMessage>;
}
export interface IAction {
  type: string;
  payload: any;
}

const initialValues: IState = {
  currentUser: { id: "", name: "" },
  isLoggedIn: false,
  messages: [],
  users: [],
};

export default function GlobalContextWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer<any>(reducer, initialValues);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}

function reducer(state: IState, { type, payload }: IAction) {
  switch (type) {
    case ACTIONS.LOGIN_USER:
      return {
        ...state,
        currentUser: payload,
        isLoggedIn: Boolean(payload),
      };

    case ACTIONS.SEND_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, payload],
      };

    case ACTIONS.SAVE_ONLINE_USERS:
      return {
        ...state,
        users: payload,
      };

    case ACTIONS.SAVE_MESSAGES:
      return {
        ...state,
        messages: payload,
      };
  }

  return state;
}

export function getLoginUserAction(data: any) {
  return { type: ACTIONS.LOGIN_USER, payload: data } as IAction;
}

export function sendMessageAction({ reciverId, message }: any) {
  return {
    type: ACTIONS.SEND_MESSAGE,
    payload: {
      reciverId,
      message,
    },
  } as IAction;
}

export function saveOnlineUsers(data: Array<any>, socketId: string) {
  const array = data.filter((item) => item.id != socketId);
  return { type: ACTIONS.SAVE_ONLINE_USERS, payload: array || [] };
}

export function saveMessages(data: any) {
  return { type: ACTIONS.SAVE_MESSAGES, payload: data || [] };
}
