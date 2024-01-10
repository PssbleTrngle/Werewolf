import { preloadTranslations } from "@/lib/server/localization";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

export function prefetchQueries<T>(
  fetcher: (ctx: GetServerSidePropsContext, client: QueryClient) => Promise<T>,
): GetServerSideProps {
  return async (ctx) => {
    const client = new QueryClient();

    const [{ props }, additionalProps] = await Promise.all([
      preloadTranslations(ctx),
      fetcher(ctx, client),
    ]);

    const dehydratedState = dehydrate(client);

    // TODO fail if query failed?

    return { props: { ...props, dehydratedState, ...additionalProps } };
  };
}
