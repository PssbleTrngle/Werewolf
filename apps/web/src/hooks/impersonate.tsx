import { Id } from "models";
import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

const CTX = createContext<[Id | undefined, Dispatch<Id | undefined>]>([
  undefined,
  () => {
    throw new Error("missing impersonation context");
  },
]);

export default function useImpersonation() {
  return useContext(CTX);
}

export function ImpersonationProvider(props: Readonly<PropsWithChildren>) {
  const state = useState<Id>();
  return <CTX.Provider {...props} value={state} />;
}
