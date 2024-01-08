import React, { ChangeEvent, FormEvent } from "react";
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginStyled } from "./Login.styled";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { loginRoute } from "../../utils/APIRoutes";
import axios, { AxiosError, AxiosResponse } from "axios";

type RegValues = {
  username: string;
  password: string;
};
type ResponseData = {
  success: boolean;
  msg: string;
  user?: {};
  accessToken?: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = React.useState<RegValues>({
    username: "",
    password: "",
  });
  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (handleValidation()) {
      try {
        const { password, username } = values;
        const { data } = await axios.post<
          undefined,
          AxiosResponse<ResponseData>
        >(loginRoute, {
          username,
          password,
        });

        console.log("data:", data);
        if (data.success === true) {
          localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        }
        navigate("/");
      } catch (err) {
        let error = { ...(err as AxiosError<ResponseData>) };
        toast.error(error.response?.data.msg, { ...toastOptions });
      }
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target);
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleValidation() {
    const { password, username } = values;

    if (username.length < 3) {
      toast.error("Username should contain more than 3 characters.", {
        ...toastOptions,
      });
      return false;
    } else if (password.length < 8) {
      toast.error("Password should be greater than 8 characters.", {
        ...toastOptions,
      });
      return false;
    }
    return true;
  }

  return (
    <LoginStyled>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="brand">
          <img src={Logo} alt="logo" />
          <h1>snappy</h1>
        </div>
        <Input
          type="text"
          name="username"
          label="Username"
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          label="Password"
          onChange={handleChange}
        />
        <Button type="submit" label="Login" />
        <span>
          Don't have an account? <Link to="/register">Register</Link>
        </span>
      </form>
      <ToastContainer />
    </LoginStyled>
  );
};

export default Register;
