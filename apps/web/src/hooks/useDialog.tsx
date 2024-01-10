import {
  PropsWithChildren,
  ReactNode,
  RefObject,
  createContext,
  createRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

const CTX = createContext<RefObject<HTMLElement | null>>(createRef());

export default function useDialog() {
  const target = useContext(CTX);

  const render = useCallback(
    (node: ReactNode) => {
      return target.current && createPortal(node, target.current);
    },
    [target],
  );

  return useMemo(() => ({ render }), [render]);
}

export function DialogTarget(props: Readonly<PropsWithChildren>) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <DialogTargetElement ref={ref} />
      <CTX.Provider {...props} value={ref} />
    </>
  );
}

const DialogTargetElement = styled.section`
  position: absolute;
`;
