import React from "react";
import styled from "styled-components";
import { GlobalStyle } from "./utils/globalStyle";
import { Route, Routes } from "react-router-dom";

const RegisterLazy = React.lazy(() => import("./pages/register/Register"));
const LoginLazy = React.lazy(() => import("./pages/login/Login"));
const SetAvatarLazy = React.lazy(() => import("./pages/setAvatar/SetAvatar"));
const ChatLazy = React.lazy(() => import("./pages/chat/Chat"));

function App() {
  return (
    <AppStyled>
      <GlobalStyle />
      <Routes>
        {/**
         * @component Register page
         */}
        <Route
          path="/register"
          element={
            <React.Suspense fallback="loading...">
              <RegisterLazy />
            </React.Suspense>
          }
        />
        {/**
         * @component Login page
         */}
        <Route
          path="/login"
          element={
            <React.Suspense fallback="loading...">
              <LoginLazy />
            </React.Suspense>
          }
        />
        {/**
         * @component set avatar page
         */}
        <Route
          path="/setAvatar"
          element={
            <React.Suspense fallback="loading...">
              <SetAvatarLazy />
            </React.Suspense>
          }
        />
        {/**
         * @component Chat page
         */}
        <Route
          path="/"
          element={
            <React.Suspense fallback="loading...">
              <ChatLazy />
            </React.Suspense>
          }
        />
      </Routes>
    </AppStyled>
  );
}

const AppStyled = styled.div``;

export default App;
