import styled from "styled-components/macro";

export const Point = styled.div`
  position: absolute;
  height: 100%;
  transform-origin: bottom;
  width: 2px;
  right: calc(50% - 1px);
  border-top: ${({ isStrong }) => (isStrong ? 20 : 10)}px solid
    ${({ isGreen }) => (isGreen ? "#a9c519" : "#b2b2b2")};
  transform: rotate(${({ angle }) => angle}deg);
`;
