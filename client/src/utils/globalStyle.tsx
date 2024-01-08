import { css, createGlobalStyle } from "styled-components";

const resetCSS = css`
  // variables
  :root {
  }

  // resets
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;
  }
`;

const BaseCSS = createGlobalStyle`
    ${resetCSS}
`;

export const GlobalStyle = () => <BaseCSS />;
