import type { PropsWithChildren, ReactNode, RefObject } from "react";
import {
  createContext,
  createRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

const Context = createContext<RefObject<HTMLElement | null>>(createRef());

export default function useDialog() {
  const target = useContext(Context);

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
      <Context.Provider {...props} value={ref} />
    </>
  );
}

const DialogTargetElement = styled.section`
  position: absolute;
`;
