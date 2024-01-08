import React from "react";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import { ChatInputStyled } from "./ChatInput.styled";

type Props = {
  handleSendMsg: (msg: string) => void;
};

const ChatInput: React.FC<Props> = ({ handleSendMsg }) => {
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const handleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji: EmojiClickData, event: MouseEvent) => {
    console.log(emoji);
    let message = msg;
    message += emoji.emoji;
    setMsg(message);
  };

  const sendChat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <ChatInputStyled>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPicker} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="type your text here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="submit">
          <IoMdSend />
        </button>
      </form>
    </ChatInputStyled>
  );
};

export default ChatInput;
