import React from "react";
import styled from "styled-components/macro";

const ButtonWrapper = styled.button`
  display: flex;
  justify-content: ${({ isActive }) => (isActive ? "flex-end" : "flex-start")};
  align-items: center;
  width: 100px;
  height: 50px;
  margin-top: 40px;
  border: 0;
  outline: none;
  background-color: ${({ isActive }) => (isActive ? "#93ccbf" : "#fff")};
  padding: 5px;
  cursor: pointer;
  border-radius: 4px;
`;

const ButtonContent = styled.div`
  position: relative;
  width: 40px;
  height: 38px;
  background: ${({ isActive }) => (isActive ? "#fff" : "#93ccbf")};
  border-radius: 4px;
`;

export const Button = ({ isActive, onClick }) => (
  <ButtonWrapper isActive={isActive} onClick={onClick}>
    <ButtonContent isActive={isActive} />
  </ButtonWrapper>
);
