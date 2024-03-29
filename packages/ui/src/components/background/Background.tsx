import { GameInfo, Time } from "models";
import { transparentize } from "polished";
import { ReactNode, useEffect, useMemo, useReducer } from "react";
import styled from "styled-components";
import Button from "../Button";
import Clouds from "./Clouds";
import { Moon, Sun } from "./Luminary";

const SUN_GRADIENTS: Partial<Record<Time, string[]>> = {
  dawn: ["#e6de7a", "#e0942f", "#c44e18"].reverse(),
  dusk: ["#c44e18", "#8f334d", "#60396b"],
};

const BG: Record<Time, string> = {
  dawn: "#477bbf",
  day: "#6995cf",
  dusk: "#2b224a",
  night: "#100e24",
};

const ANGLES = {
  moon: {
    dawn: -60,
    day: 0,
    dusk: 60,
    night: 180,
  },
  sun: {
    dawn: 90,
    day: 180,
    dusk: 270,
    night: 360,
  },
} satisfies Record<string, Record<Time, number>>;

export default function Background({
  game,
  children,
  ...props
}: Readonly<{
  game: GameInfo;
  children?: ReactNode;
}>) {
  const sunAngle = useMemo(() => {
    const rotation = ANGLES.sun[game.time];
    return game.day * 360 + rotation;
  }, [game]);

  const moonAngle = useMemo(() => {
    const rotation = ANGLES.moon[game.time];
    return game.day * 360 + rotation;
  }, [game]);

  // prevent server-client-missmatch-error due to random positions of clouds
  const [isClient, loadClient] = useReducer(() => true, false);
  useEffect(loadClient, [loadClient]);

  return (
    <Style $time={game.time} {...props}>
      {isClient && (
        <>
          <Horizon>
            <Sun $angle={sunAngle} $glow={SUN_GRADIENTS[game.time]} />
            <Moon
              $angle={moonAngle}
              $opacity={game.time === "night" ? 1 : 0.5}
            />
          </Horizon>
          <Clouds />
        </>
      )}
      {children}
    </Style>
  );
}

const Style = styled.section<{ $time: Time }>`
  position: relative;
  overflow: hidden;
  min-height: 100%;

  background: ${(p) => BG[p.$time]};

  ${Button} {
    background: ${(p) => transparentize(0.5, BG[p.$time])};
    backdrop-filter: blur(5px);

    will-change: backdrop-filter;
  }

  transition:
    background 0.5s linear,
    color 0.5s linear;
`;

const Horizon = styled.section`
  position: absolute;
  width: 100%;
  height: 100%;

  bottom: 0;
`;
