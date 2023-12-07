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

const CTX = createContext<RefObject<HTMLElement | null>>(createRef());

export default function useDialog() {
  const target = useContext(CTX);

  const render = useCallback(
    (node: ReactNode) => {
      return target.current && createPortal(node, target.current);
    },
    [target]
  );

  return useMemo(() => ({ render }), [render]);
}

export function DialogTarget(props: Readonly<PropsWithChildren>) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <section ref={ref} />
      <CTX.Provider {...props} value={ref} />
    </>
  );
}
