import { DispatchWithoutAction, PropsWithChildren, useCallback } from "react";
import styled, { css } from "styled-components";
import { Buttons } from "../components/Button";
import { useWindowEvent } from "../hooks/events";

export type DialogProps = Readonly<{
  onClose: DispatchWithoutAction;
  visible?: boolean;
}>;

export default function Dialog({
  onClose,
  visible,
  children,
  ...props
}: Readonly<PropsWithChildren<DialogProps>>) {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Escape") onClose();
    },
    [onClose],
  );

  useWindowEvent("keydown", onKeyDown);

  return (
    <>
      <Curtain aria-hidden $visible={visible} onClick={onClose} />
      <Style $visible={visible} {...props}>
        {children}
      </Style>
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

  padding: 2em;
  padding-top: 0em;

  background: ${(p) => p.theme.bg};
  box-shadow: 2px 5px 20px 0 #000d;
  border-radius: 0.5em;

  h2 {
    text-align: center;
    margin: 1em 0;
  }

  ${Buttons} {
    margin-top: 1em;
  }

  ${(p) => !p.$visible && HiddenDialog};

  transition: top 0.2s ease-out;
`;
