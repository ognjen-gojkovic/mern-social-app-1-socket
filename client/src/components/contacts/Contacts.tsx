import React from "react";
import { ContactsStyled } from "./Contacts.styled";
import { User } from "../../pages/chat/Chat";
import Logo from "../../assets/logo.svg";

type Props = {
  contacts: User[];
  currentUser: User | undefined;
  changeChat: (chat: User) => void;
};

const Contacts: React.FC<Props> = ({ contacts, currentUser, changeChat }) => {
  const [currentUserName, setCurrentUserName] = React.useState("");
  const [currentUserImage, setCurrentUserImage] = React.useState("");
  const [currentSelected, setCurrentSelected] = React.useState<
    number | undefined
  >(undefined);

  React.useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (idx: number, contact: User) => {
    setCurrentSelected(idx);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <ContactsStyled>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>snappy</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, idx) => {
              return (
                <div
                  className={`contact ${
                    idx === currentSelected ? "selected" : ""
                  }`}
                  key={idx}
                  onClick={() => changeCurrentChat(idx, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt="avatar"
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </ContactsStyled>
      )}
    </>
  );
};

export default Contacts;
