import styled, { keyframes } from "styled-components";

type CloudProps = Readonly<{
  height: number;
  width: number;
  id: string;
  x: number;
  y: number;
}>;

const CLOUDS = new Array(10).fill(null).map<CloudProps>((_, i) => {
  const height = Math.random() * 50 + 10;
  const width = Math.random() * 160 + 30;
  const x = Math.random() * 200;
  const y = Math.random() * 70;
  return { height, width, id: i.toString(), x, y };
});

export default function Clouds() {
  return (
    <Style>
      {CLOUDS.flatMap((it) => [
        <Cloud key={`${it.id}-from`} {...it} />,
        <Cloud key={`${it.id}-to`} {...it} x={it.x - 200} />,
      ])}
    </Style>
  );
}

const animation = keyframes<CloudProps>`
   from {
      left: 110%;
   }
   to {
      left: -90%;
   }
`;

const Cloud = styled.div<CloudProps>`
  position: absolute;

  height: ${(p) => p.height}px;
  width: ${(p) => p.width}px;

  background: #fff;
  border-radius: ${(p) => p.height}px;

  top: ${(p) => p.y}%;

  animation: ${animation} 30s infinite linear backwards;
  animation-delay: ${(p) => (p.x / 100) * 30}s;
  will-change: left;

  filter: blur(10px);
`;

const Style = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;

  opacity: 0.2;
`;
