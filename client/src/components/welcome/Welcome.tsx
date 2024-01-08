import React from "react";
import { WelcomeStyled } from "./Welcome.styled";
import { User } from "../../pages/chat/Chat";
import Avatar1 from "../../assets/avatar-1.png";

type Props = {
  user: User | undefined;
};

const Welcome: React.FC<Props> = ({ user }) => {
  return (
    <WelcomeStyled>
      <img src={Avatar1} alt="robot" />
      <h1>
        Welcome, <span>{user?.username}</span>
      </h1>
      <h3>Please select a chat to Start messaging</h3>
    </WelcomeStyled>
  );
};

export default Welcome;
