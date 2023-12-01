import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18nextConfig from "../../next-i18next.config";

export const preloadTranslations: GetStaticProps = async ({
  locale = i18nextConfig.i18n.defaultLocale,
}) => {
  const translations = await serverSideTranslations(
    locale,
    i18nextConfig.ns as string[]
  );
  return {
    props: {
      ...translations,
    },
  };
};
