import styled from "styled-components";

const SIZE = 100;

const Luminary = styled.div<{ $angle: number; $glow?: string[] }>`
  position: absolute;

  top: 95%;
  left: 50%;
  transform: translateX(-50%) rotate(${(p) => p.$angle}deg)
    translateY(min(30vw, 30vh)) rotate(${(p) => -p.$angle}deg);

  width: ${SIZE}px;
  height: ${SIZE}px;

  &::before,
  &::after {
    content: "";
    position: absolute;
  }

  &::before {
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;

    box-shadow: ${(p) =>
      p.$glow
        ?.map((color, i, a) => ({ color, offset: (i + 1) / a.length }))
        ?.map(
          ({ color, offset }) =>
            `0 ${offset * 400}px ${offset * 300}px ${offset * 500}px ${color}`
        )
        .join(",")};

    transition: box-shadow 0.15s linear;
  }

  &::after {
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;

    border-radius: 9999px;
    background: #fff;
  }

  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
`;

export const Sun = styled(Luminary)`
  &::after {
    box-shadow: 0 0 20px 5px #fff;
  }
`;

export const Moon = styled(Luminary)<{ $opacity: number }>`
  filter: drop-shadow(0 0 20px #fff);

  opacity: ${(p) => p.$opacity};

  &::after {
    clip-path: path("${`M10,23 A50,50,0,1,1,10,77 A30,30,0,1,0,10,23`}");
  }
`;
