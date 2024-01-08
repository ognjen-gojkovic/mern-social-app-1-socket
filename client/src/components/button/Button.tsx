import React from "react";
import { ButtonStyled } from "./Button.styled";

type Props = {
  type: "button" | "submit";
  label: string;
};

const Button: React.FC<Props> = ({ type, label }) => {
  return <ButtonStyled type={type}>{label}</ButtonStyled>;
};

export default Button;
