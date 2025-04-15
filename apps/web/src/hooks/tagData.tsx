import { useSearchParams } from "react-router-dom";

export default function useTagData() {
  const [params] = useSearchParams();

  if (params.has("tagData")) {
    try {
      return JSON.parse(params.get("tagData")!);
    } catch {
      return null;
    }
  }

  return null;
}
