import React, { ChangeEvent } from "react";
import { InputStyled } from "./Input.styled";

type Props = {
  label: string;
  type: "text" | "email" | "password" | undefined;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<Props> = ({ label, type, name, onChange }) => {
  return (
    <InputStyled>
      <label htmlFor={name}>{label}</label>
      <input type={type} id={name} name={name} onChange={onChange} />
    </InputStyled>
  );
};

export default Input;
