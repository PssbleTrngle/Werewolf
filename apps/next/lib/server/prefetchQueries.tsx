import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { preloadTranslations } from "./localization";

export function prefetchQueries(
  fetcher: (
    ctx: GetServerSidePropsContext,
    client: QueryClient
  ) => Promise<void>
): GetServerSideProps {
  return async (ctx) => {
    const client = new QueryClient();

    const [{ props }] = await Promise.all([
      preloadTranslations(ctx),
      fetcher(ctx, client),
    ]);

    const dehydratedState = dehydrate(client);

    return { props: { ...props, dehydratedState } };
  };
}
