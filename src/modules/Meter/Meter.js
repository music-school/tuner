import React from 'react';
import { Wrapper, Point, PointValue, Pointer, Dot } from './components';

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
  { angle: 45, value: 50 },
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
          scalePoints.length - 1,
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
