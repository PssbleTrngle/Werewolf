import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const preloadTranslations: GetStaticProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale, ["common"]);
  return {
    props: {
      ...translations,
    },
  };
};
