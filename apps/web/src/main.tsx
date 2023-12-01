import "@csstools/normalize.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "i18next";
import LangDetector from "i18next-browser-languagedetector";
import LocaleBackend from "i18next-http-backend";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "ui";
import ErrorWrapper from "./components/ErrorWrapper";
import { LocalGameProvider } from "./hooks/localGame";
import { router } from "./router";

const client = new QueryClient();
const backend = new LocaleBackend();

const defaultNS = ["common", "local"];
i18n
  .use(initReactI18next)
  .use(backend)
  .use(LangDetector)
  .init({
    fallbackLng: "en",
    debug: import.meta.env.DEV,
    defaultNS,
  });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n} defaultNS={defaultNS}>
      <ThemeProvider theme={darkTheme}>
        <Suspense fallback={<p>Loading...</p>}>
          <ErrorWrapper>
            <QueryClientProvider client={client}>
              <LocalGameProvider>
                <RouterProvider router={router} />
              </LocalGameProvider>
            </QueryClientProvider>
          </ErrorWrapper>
        </Suspense>
      </ThemeProvider>
    </I18nextProvider>
  </React.StrictMode>
);
