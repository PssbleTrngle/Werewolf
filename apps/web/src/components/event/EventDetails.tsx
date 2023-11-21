import { Event } from "models";
import { useMemo } from "react";

function baseType(type: string) {
  const [base] = type.split(".");
  return base;
}

export default function EventDetails({ event }: { event: Event }) {
  const type = useMemo(() => baseType(event.type), [event]);
  return (
    <pre>
      {type}: {JSON.stringify(event.data, null, 2)}
    </pre>
  );
}
