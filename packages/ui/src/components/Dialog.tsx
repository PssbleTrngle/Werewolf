import { DispatchWithoutAction, PropsWithChildren } from "react";
import styled, { css } from "styled-components";

export type DialogProps = Readonly<{
  onClose: DispatchWithoutAction;
  visible?: boolean;
}>;

export default function Dialog({
  onClose,
  visible,
  ...props
}: Readonly<PropsWithChildren<DialogProps>>) {
  return (
    <>
      <Curtain aria-hidden $visible={visible} onClick={onClose} />
      <Style $visible={visible} {...props} />
    </>
  );
}

const ClosedCurtain = css`
  pointer-events: none;
  background: transparent;
`;

const Curtain = styled.div<{ $visible?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;

  background: #0005;

  ${(p) => !p.$visible && ClosedCurtain};

  transition: background 0.1s linear;
`;

const HiddenDialog = css`
  top: 150%;
`;

const Style = styled.div<{ $visible?: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  padding: 1em;
  padding-top: 0;

  background: ${(p) => p.theme.bg};
  box-shadow: 2px 5px 5px 0 #0005;
  border-radius: 0.5em;

  h2 {
    text-align: center;
  }

  ${(p) => !p.$visible && HiddenDialog};

  transition: top 0.2s ease-out;
`;
