import { GameStatus, Time } from "models";
import { ReactNode, useMemo } from "react";
import styled from "styled-components";
import Clouds from "./Clouds";
import { Moon, Sun } from "./Luminary";

const gradient = (colors: string[]) => `
linear-gradient(${colors.join(",")})
`;

const fadingGradient = (colors: string[]) => {
  return gradient(
    colors.map((it, i, a) => `${it} ${Math.pow(i / a.length, 0.4) * 100}%`)
  );
};

/*
const GRADIENTS: Record<Time, string> = {
  dawn: fadingGradient([
    "#1f406b",
    "#477bbf",
    "#6995cf",
    "#cfb969",
    "#e0942f",
    "#c44e18",
  ]),
  day: gradient(["#477bbf", "#6995cf"]),
  dusk: fadingGradient(["#100e24", "#2b224a", "#484391", "#60396b", "#8f334d"]),
  night: gradient(["#100e24", "#0e1424"]),
};
*/

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
  status,
  children,
  ...props
}: Readonly<{
  status: GameStatus;
  children?: ReactNode;
}>) {
  const sunAngle = useMemo(() => {
    const rotation = ANGLES.sun[status.time];
    return status.day * 360 + rotation;
  }, [status]);

  const moonAngle = useMemo(() => {
    const rotation = ANGLES.moon[status.time];
    return status.day * 360 + rotation;
  }, [status]);

  return (
    <Style $time={status.time} {...props}>
      <Sun $angle={sunAngle} $glow={SUN_GRADIENTS[status.time]} />
      <Moon $angle={moonAngle} $opacity={status.time === "night" ? 1 : 0.5} />
      <Clouds />
      {children}
    </Style>
  );
}

const Style = styled.section<{ $time: Time }>`
  position: relative;
  overflow: hidden;

  background: ${(p) => BG[p.$time]};
  height: 100%;
  width: 100%;

  display: grid;
  align-items: center;
  justify-content: center;

  transition: background 0.5s linear, color 0.5s linear;
`;
