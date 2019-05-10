import React from "react";
import styled from "styled-components/macro";

const Wrapper = styled.div`
  margin-top: 50px;
  position: relative;
  display: flex;
  width: 500px;
  height: 250px;
`;

const getPointAndPointerCommonStyles = ({ angle }) => `
  position: absolute;
  height: 100%;
  transform-origin: bottom;
  width: 2px;
`;

const Point = styled.div`
  ${getPointAndPointerCommonStyles};

  right: calc(50% - 1px);
  border-top: ${({ isStrong }) => (isStrong ? 20 : 10)}px solid
    ${({ isGreen }) => (isGreen ? "#a9c519" : "#b2b2b2")};
  transform: rotate(${({ angle }) => angle}deg);
`;

const PointValue = styled.div`
  position: absolute;
  top: ${({ isSmallTopMargin }) => (isSmallTopMargin ? -35 : -45)}px;
  left: 50%;
  transform: translateX(-50%);
  color: ${({ isGreen }) => (isGreen ? "#a9c519" : "#b2b2b2")};
`;

const Pointer = styled.div`
  ${getPointAndPointerCommonStyles};

  height: calc(100% - 30px);
  background-color: #266980;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) rotate(${({ angle }) => angle}deg);
  z-index: 10;
`;

const Dot = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #266980;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
`;

const scalePoints = [
  { angle: -45, value: -50 },
  { angle: -36 },
  { angle: -27, value: -30 },
  { angle: -18 },
  { angle: -9 },
  { angle: 0, value: 0 },
  { angle: 9 },
  { angle: 18 },
  { angle: 27, value: 30 },
  { angle: 36 },
  { angle: 45, value: 50 }
];

export const Meter = ({ cents, ...props }) => (
  <Wrapper {...props}>
    <Dot />
    <Pointer angle={isNaN(cents) ? 0 : cents * (90 / 100)} />
    {scalePoints.map((point, index) => (
      <Point
        key={point.angle}
        angle={point.angle}
        isStrong={[
          0,
          Math.ceil((scalePoints.length - 1) / 2),
          scalePoints.length - 1
        ].some(i => i === index)}
        isGreen={Math.abs(point.angle) === 9 || point.angle === 0}
      >
        <PointValue
          isSmallTopMargin={Math.abs(point.value) === 30}
          isGreen={point.value === 0}
        >
          {point.value}
        </PointValue>
      </Point>
    ))}
  </Wrapper>
);
