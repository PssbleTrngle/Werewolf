import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { Game } from "logic";

export function createLocalClient() {
  const game = new Game();

  const queryFn: QueryFunction = async ({ queryKey }) => {
    console.log("Fetching", ...queryKey);
  };

  return new QueryClient({ defaultOptions: { queries: { queryFn } } });
}
