import React, { MutableRefObject, Ref } from "react";
import { ChatContainerStyled } from "./ChatContainer.styled";
import { User } from "../../pages/chat/Chat";
import Logout from "../logout/Logout";
import ChatInput from "../chatInput/ChatInput";
import Messages from "../messages/Messages";
import { getAllMessagesRoute, sendMessageRoute } from "../../utils/APIRoutes";
import axios, { AxiosResponse } from "axios";
import { Socket } from "socket.io-client";

type Props = {
  currentChat: User | undefined;
  currentUser: User | undefined;
  socket: React.MutableRefObject<Socket | undefined>;
};

type Message = {
  fromSelf: boolean;
  message: string;
};

type Data = {
  success: boolean;
  msg: string;
  projectMessages: Message[];
};

const ChatContainer: React.FC<Props> = ({
  currentChat,
  currentUser,
  socket,
}) => {
  let scrollRef = React.useRef<HTMLDivElement>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [arrivalMsg, setArrivalMsg] = React.useState<Message | null>(null);

  React.useEffect(() => {
    async function getMessages() {
      const response = await axios.get<Data>(
        `${getAllMessagesRoute}/?from=${currentUser?._id}&to=${currentChat?._id}`
      );
      setMessages(response.data.projectMessages);
    }
    if (currentChat?._id && currentUser?._id) getMessages();
  }, [currentChat?._id, currentUser?._id]);

  const handleSendMsg = async (msg: string) => {
    await axios.post(
      sendMessageRoute,
      {
        from: currentUser?._id,
        to: currentChat?._id,
        message: msg,
      },
      { withCredentials: true }
    );
    socket.current?.emit("send_msg", {
      to: currentChat?._id,
      from: currentUser?._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  React.useEffect(() => {
    if (socket.current) {
      socket.current.on("msg_recieve", (msg) => {
        setArrivalMsg({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  React.useEffect(() => {
    arrivalMsg && setMessages((prev) => [...prev, arrivalMsg]);
  }, [arrivalMsg]);

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ChatContainerStyled>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat?.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat?.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((msg, idx) => {
          return (
            <div
              className={`message ${msg.fromSelf ? "sender" : "recieved"}`}
              ref={scrollRef}
              key={idx}
            >
              <div className="content">
                <p>{msg.message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </ChatContainerStyled>
  );
};

export default ChatContainer;
