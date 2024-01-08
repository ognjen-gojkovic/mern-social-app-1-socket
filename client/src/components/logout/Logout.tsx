import React from "react";
import { LogoutStyled } from "./Logout.styled";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";

const Logout = () => {
  const navigate = useNavigate();

  const handleClick = async () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <LogoutStyled onClick={handleClick}>
      <BiPowerOff />
    </LogoutStyled>
  );
};

export default Logout;
