import { createGlobalStyle } from "styled-components";
import { normalize } from "polished";

export const GlobalStyle = createGlobalStyle`
  ${normalize()}

  html,
  body {
    width: 100%;
  }

  body {
    background-color: #303030;
    font-family: Arial, Helvetica, sans-serif
  }
`;
