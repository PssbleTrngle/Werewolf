import styled, { keyframes } from "styled-components";
import { Centered, FOOTER_HEIGHT } from "ui";
import Layout from "../views/Layout";

export default function LoadingPage() {
  return (
    <Layout>
      <Style>
        <LoadingIcon>
          <LoadingBlob $delay={0} />
          <LoadingBlob $delay={0.4} />
          <LoadingBlob $delay={0.8} />
        </LoadingIcon>
      </Style>
    </Layout>
  );
}

const Style = styled(Centered)`
  height: calc(100dvh - ${FOOTER_HEIGHT}px);
`;

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
