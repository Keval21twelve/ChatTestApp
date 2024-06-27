"use client";

import { createContext, useReducer } from "react";
export const GlobalContext = createContext({});

export const ACTIONS = {
  LOGIN_USER: "login.user",
  SEND_MESSAGE: "send.message",
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
  users: [
    {
      id: "1",
      name: "one",
    },
    {
      id: "2",
      name: "two",
    },
  ],
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
        currentUser: { id: "", name: payload },
        isLoggedIn: Boolean(payload),
      };

    case ACTIONS.SEND_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: new Date().getTime(),
            message: payload.message,
            reciverId: payload.reciverId,
            senderId: state.currentUser.id,
            timeStamp: new Date().getTime(),
          },
        ],
      };
  }

  return state;
}

export function getLoginUserAction(name: string) {
  return { type: ACTIONS.LOGIN_USER, payload: name } as IAction;
}

export function sendMessageAction({
  reciverId,
  message,
}: {
  reciverId: string;
  message: string;
}) {
  return {
    type: ACTIONS.SEND_MESSAGE,
    payload: {
      reciverId,
      message,
    },
  } as IAction;
}
