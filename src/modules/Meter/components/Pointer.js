import styled from 'styled-components/macro';

export const Pointer = styled.div`
  position: absolute;
  height: 100%;
  transform-origin: bottom;
  width: 2px;
  height: calc(100% - 30px);
  background-color: #266980;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) rotate(${({ angle }) => angle}deg);
  z-index: 10;
  transition: all 0.5s;
`;
