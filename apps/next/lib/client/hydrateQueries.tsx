import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";
import { FC, createElement } from "react";

export function withPrefetched<T extends Record<string, unknown>>(
  component: FC<T>,
) {
  const wrapped = ({
    dehydratedState,
    ...props
  }: T & Readonly<{ dehydratedState: DehydratedState }>) => {
    return (
      <HydrationBoundary state={dehydratedState}>
        {createElement(component, props as unknown as T)}
      </HydrationBoundary>
    );
  };

  wrapped.disableName = component.displayName;

  return wrapped;
}
