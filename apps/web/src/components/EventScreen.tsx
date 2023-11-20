import { useQuery } from "@tanstack/react-query";

export default function EventScreen() {
  const { data } = useQuery({ queryKey: ["screen"] });

  return (
    <div>
      <p>test</p>
    </div>
  );
}
