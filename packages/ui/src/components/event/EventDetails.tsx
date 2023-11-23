import { Event } from "models";
import { ReactNode, createElement, useMemo } from "react";
import DeathDetails from "./detail/DeathDetails";
import RevealDetail from "./detail/RevealDetails";

function baseType(type: string) {
  const [base] = type.split(".");
  return base;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const details: Record<string, (props: { data: any }) => ReactNode> = {
  reveal: RevealDetail,
  announcement: DeathDetails,
};

export default function EventDetails({ event }: { event: Event }) {
  const type = useMemo(() => baseType(event.type), [event]);
  const component = useMemo(() => details[type], [type]);
  return component && createElement(component, { data: event.data });
}
