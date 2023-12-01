import { useTranslation } from "next-i18next";
import { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";

/**
 * because the components in the ui package import the `useTranslation` hook
 * from react-18next instead of next-18next, the actual i18n instance is missing
 * while server-side-rendering, causing a client-server text missmatch
 */
export function LocalizationForward(props: Readonly<PropsWithChildren>) {
  const { i18n } = useTranslation();

  return <I18nextProvider {...props} i18n={i18n} />;
}
