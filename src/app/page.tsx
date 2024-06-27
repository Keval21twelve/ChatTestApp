"use client";

import styled from "styled-components";

import useSocket from "@/hooks/useSocket";

import { useState, useContext, useEffect, useCallback } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  List,
  Empty,
  message,
} from "antd";

import {
  IUser,
  IMessage,
  GlobalContext,
  sendMessageAction,
  getLoginUserAction,
} from "@/contexts/GlobalContext";

import ChatBgImage from "@/assets/chat-bg.webp";

export default function Home() {
  return (
    <div className="container">
      <ConnectSocket />
      <BeforeLoginScreen />
      <AfterLoginScreen />
    </div>
  );
}

function BeforeLoginScreen() {
  const { state, dispatch } = useContext(GlobalContext) as any;
  const [flag, setFlag] = useState(false);

  const handleLogin = useCallback(
    (name: string) => {
      dispatch(getLoginUserAction(name));
      message.success("You are logged in now");
    },
    [dispatch]
  );

  useEffect(() => {
    const isLoggedIn = !state?.isLoggedIn;
    setFlag(isLoggedIn);
  }, [state]);

  return (
    <div>
      <LoginPopup open={flag} onLogin={handleLogin} />
    </div>
  );
}

function AfterLoginScreen() {
  const { state, dispatch } = useContext(GlobalContext) as any;
  const canUserIntreact = Boolean(state?.isLoggedIn);
  const userId = state.currentUser.id;
  const userName = state.currentUser.name;

  const [reciverUser, setReciverUser] = useState<null | IUser>(null);

  const handleCloseChat = useCallback(() => {
    setReciverUser(null);
  }, []);

  const messages = state.messages
    .filter(({ reciverId, senderId }: IMessage) =>
      [reciverId, senderId].includes(userId)
    )
    .sort((a: IMessage, b: IMessage) => a.timeStamp - b.timeStamp);

  const isUserSelected = Boolean(reciverUser);

  const handleSendMessage = useCallback(
    (text: string) => {
      dispatch(
        sendMessageAction({
          message: text,
          reciverId: reciverUser?.id as string,
        })
      );
    },
    [dispatch, reciverUser]
  );

  return (
    <ChatScreen>
      {/* row 1 */}
      <StyledHeader>Messages</StyledHeader>
      <StyledHeader>
        {isUserSelected && (
          <>
            <div>{reciverUser?.name}</div>
            <div className="cross">
              <Button onClick={handleCloseChat} shape="circle">
                &#10060;
              </Button>
            </div>
          </>
        )}
      </StyledHeader>
      {/* row 2 */}
      <ChatItemContainer>
        <List
          size="large"
          dataSource={state.users}
          renderItem={(item: IUser) => (
            <List.Item onClick={() => setReciverUser(item)}>
              {item.name}
            </List.Item>
          )}
        />
      </ChatItemContainer>
      <MessageScreen>
        {isUserSelected && (
          <>
            <Messages>
              {messages.map((item: IMessage, index: number) => {
                const isSender = item.senderId == userId;
                return (
                  <div
                    key={"message-" + index}
                    style={{ textAlign: isSender ? "right" : "left" }}
                  >
                    <MessageBox>
                      <label>{isSender ? userName : reciverUser?.name}</label>
                      <p>{item.message}</p>
                    </MessageBox>
                  </div>
                );
              })}
            </Messages>
            {canUserIntreact && <ChatInput onSend={handleSendMessage} />}
          </>
        )}
        {!isUserSelected && (
          <div>
            <EmptyUser>
              <Empty description={"Please select a user to start the chat"} />
            </EmptyUser>
          </div>
        )}
      </MessageScreen>
    </ChatScreen>
  );
}

function LoginPopup({ open, onLogin }: { open: boolean; onLogin: Function }) {
  const { state, dispatch } = useContext(GlobalContext) as any;

  const [form] = Form.useForm();

  function isUsernameAvailable(userName: string) {
    const users = state.users;
    const found = !!users.find(
      ({ name }: { name: string }) =>
        String(userName)
          .toLowerCase()
          .localeCompare(String(name).toLowerCase()) == 0
    );
    return found;
  }

  function handleSubmit(name: string) {
    if (!isUsernameAvailable(name)) {
      onLogin(name);
    } else {
      form.setFields([
        {
          name: "name",
          errors: ["* Username is not available"],
        },
      ]);
    }
  }

  return (
    <Modal open={open} footer={null} title={"Login"} closable={false}>
      <br />
      <Form
        form={form}
        onFinish={(data) => handleSubmit(String(data.name).trim())}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "* Username is required" }]}
        >
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <Input placeholder="Enter user name" width={"100%"} />
            </Col>
          </Row>
        </Form.Item>
        <br />
        <Row justify={"end"}>
          <Col>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

function ChatInput({ onSend }: { onSend: Function }) {
  const [message, setMessage] = useState("");
  return (
    <InputContainer>
      <div>
        <Input.Search
          size="large"
          width={"100%"}
          value={message}
          bordered={false}
          enterButton="Send"
          placeholder="Type a message.."
          onSearch={() => {
            onSend(message);
            setMessage("");
          }}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
    </InputContainer>
  );
}

function ConnectSocket() {
  const {} = useSocket();

  return <></>;
}

const ChatItemContainer = styled.div`
  height: calc(100vh - 70px);
  overflow-y: auto;
`;

const EmptyUser = styled.div`
  top: 50%;
  left: 50%;
  padding: 20px;
  position: absolute;
  border-radius: 20px;
  display: inline-block;
  background-color: white;
  transform: translate(-50%, -50%);
  box-shadow: 0px 0px 10px lightgray;
`;

const MessageBox = styled.div`
  padding: 8px;
  border-radius: 8px;
  display: inline-block;
  background-color: white;
  box-shadow: 0px 0px 10px lightgray;

  & label {
    font-size: 14px;
    font-weight: bold;
  }
  & p {
    font-size: 16px;
    padding-top: 4px;
  }
`;

const Messages = styled.div`
  gap: 10px;
  flex-grow: 1;
  padding: 10px;
  display: flex;
  overflow-y: auto;
  flex-flow: column;
`;

const InputContainer = styled.div`
  & > div {
    width: 60%;
    padding: 1px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0px 0px 10px gray;
  }

  display: flex;
  justify-content: center;
`;

const ChatScreen = styled.div`
  display: grid;
  height: 100vh;
  overflow: hidden;
  grid-template-rows: 62px 1fr;
  grid-template-columns: 400px 1fr;
`;

const MessageScreen = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  height: calc(100vh - 70px);
  border: 1px solid rgba(5, 5, 5, 0.06);
  background-image: url(${ChatBgImage.src});
`;

const StyledHeader = styled.div`
  color: white;
  padding: 10px;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: #4096ff;

  & .cross {
    right: 16px;
    position: absolute;
  }
`;
