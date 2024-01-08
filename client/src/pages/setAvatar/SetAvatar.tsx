import React from "react";
import { SetAvatarStyled } from "./SetAvatar.styled";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import axios, { AxiosResponse } from "axios";
import { Buffer } from "buffer";
import { setAvatarRoute } from "../../utils/APIRoutes";
import InfinityLoader from "../../assets/InfinityLoader.svg";

type ResponseData = {
  success: boolean;
  msg: string;
  isSet?: boolean;
  image?: string;
};

const SetAvatar = () => {
  const api = "https://api.multiavatar.com/45678945";
  const navigate = useNavigate();
  const [avatars, setAvatars] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedAvatar, setSelectedAvatar] = React.useState<
    number | undefined
  >(undefined);
  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = JSON.parse(localStorage.getItem("chat-app-user") as string);
      const res = await axios.post<ResponseData, AxiosResponse<ResponseData>>(
        `${setAvatarRoute}/${user._id}`,
        {
          image: avatars[selectedAvatar],
        }
      );

      if (res.data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = res.data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again", toastOptions);
      }
    }
  };

  const fetchAvatars = async () => {
    const data = [];

    for (let i = 0; i < 4; i++) {
      const image = await axios.get(
        `${api}/${Math.round(Math.random() * 1000)}`
      );
      console.log(image);
      const buffer = new Buffer(image.data);
      data.push(buffer.toString("base64"));
    }
    setAvatars(data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, [navigate]);

  React.useEffect(() => {
    fetchAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <SetAvatarStyled>
          <img src={InfinityLoader} alt="loader" />
        </SetAvatarStyled>
      ) : (
        <SetAvatarStyled>
          <div className="title-container">
            <h1>Pick avatar for your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avtr, idx) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === idx ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avtr}`}
                    alt={`avatar-${idx}`}
                    onClick={() => setSelectedAvatar(idx)}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as Profile Picture
          </button>
        </SetAvatarStyled>
      )}

      <ToastContainer />
    </>
  );
};

export default SetAvatar;
