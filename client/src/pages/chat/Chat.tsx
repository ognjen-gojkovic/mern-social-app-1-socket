import React from "react";
import { ChatStyled } from "./Chat.styled";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { allUsersRoute, host } from "../../utils/APIRoutes";
import Contacts from "../../components/contacts/Contacts";
import Welcome from "../../components/welcome/Welcome";
import ChatContainer from "../../components/chatContainer/ChatContainer";
import { Socket, io } from "socket.io-client";

export type User = {
  _id: string;
  username: string;
  email: string;
  avatarImage: string;
  isAvatarImageSet: boolean;
};

type ResObj = {
  success: boolean;
  mag: string;
  users: User[];
};

const Chat = () => {
  const socket = React.useRef<Socket>();
  const navigate = useNavigate();
  const [contacts, setContacts] = React.useState<User[]>([]);
  const [currentUser, setCurrentUser] = React.useState<User | undefined>(
    undefined
  );
  const [currentChat, setCurrentChat] = React.useState<User | undefined>(
    undefined
  );
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    } else {
      setCurrentUser(
        JSON.parse(localStorage.getItem("chat-app-user") as string)
      );
      setIsLoaded(true);
    }
  }, [navigate]);

  React.useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add_user", currentUser?._id);
    }
  }, [currentUser]);

  React.useEffect(() => {
    async function fetchData(): Promise<void> {
      const data = await axios.get<ResObj>(
        `${allUsersRoute}/${currentUser?._id}`
      );
      setContacts(data.data.users);
    }

    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        fetchData();
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser, navigate]);

  const handleChatChange = (chat: User) => {
    setCurrentChat(chat);
  };
  return (
    <ChatStyled>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome user={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </ChatStyled>
  );
};

export default Chat;
