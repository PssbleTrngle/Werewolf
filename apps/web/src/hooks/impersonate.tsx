import { Id } from "models";
import { Dispatch, createContext, useContext } from "react";

const CTX = createContext<[Id | undefined, Dispatch<Id | undefined>]>([
  undefined,
  () => {
    throw new Error("missing impersonation context");
  },
]);

export default function useImpersonation() {
  return useContext(CTX);
}

export const ImpersonationProvider = CTX.Provider;
