import i18nextConfig from "@/next-i18next.config";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";

export const preloadTranslations = async ({
  locale = i18nextConfig.i18n.defaultLocale,
}) => {
  const translations = await serverSideTranslations(
    locale,
    i18nextConfig.ns as string[],
  );
  return {
    props: {
      ...translations,
    },
  };
};
