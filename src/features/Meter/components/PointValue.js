import styled from "styled-components/macro";

export const PointValue = styled.div`
  position: absolute;
  top: ${({ isSmallTopMargin }) => (isSmallTopMargin ? -35 : -45)}px;
  left: 50%;
  transform: translateX(-50%);
  color: ${({ isGreen }) => (isGreen ? "#a9c519" : "#b2b2b2")};
`;
