import styled, { keyframes } from "styled-components";
import Centered from "./Centered";

export default function Loading(props: Readonly<{}>) {
  return (
    <Centered {...props}>
      <LoadingIcon>
        <LoadingBlob $delay={0} />
        <LoadingBlob $delay={0.4} />
        <LoadingBlob $delay={0.8} />
      </LoadingIcon>
    </Centered>
  );
}

const bopping = keyframes`
   from {
      transform: translateY(20%);
   }
   to {
      transform: translateY(-20%);
   }
`;

const LoadingIcon = styled.div`
  display: flex;
  gap: 0.2em;
`;

const ANIMATION_DURATION = 0.5;

const LoadingBlob = styled.div<{ $delay: number }>`
  height: 1em;
  width: 1em;
  background: ${(p) => p.theme.text};
  border-radius: 1em;

  animation: ${bopping} ${ANIMATION_DURATION}s ease-in-out infinite alternate;
  animation-delay: ${(p) => p.$delay * ANIMATION_DURATION}s;
`;
