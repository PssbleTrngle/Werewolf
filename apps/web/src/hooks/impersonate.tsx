import type { Id } from "models";
import type { Dispatch } from "react";
import { createContext, useContext } from "react";

const Context = createContext<[Id | undefined, Dispatch<Id | undefined>]>([
  undefined,
  () => {
    throw new Error("missing impersonation context");
  },
]);

export default function useImpersonation() {
  return useContext(Context);
}

export const ImpersonationProvider = Context.Provider;
