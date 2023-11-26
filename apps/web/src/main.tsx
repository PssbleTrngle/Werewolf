import "@csstools/normalize.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "i18next";
import LocaleBackend from "i18next-http-backend";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { initReactI18next } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GameProvider, darkTheme } from "ui";
import ErrorWrapper from "./ErrorWrapper";
import { createLocalGame } from "./client/local";
import { router } from "./router";

const client = new QueryClient();
const game = createLocalGame();
const backend = new LocaleBackend(null, {
  loadPath: "/locales/{{lng}}.json",
});
i18n.use(initReactI18next).use(backend).init({ fallbackLng: "en" });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorWrapper>
          <GameProvider value={game}>
            <QueryClientProvider client={client}>
              <RouterProvider router={router} />
            </QueryClientProvider>
          </GameProvider>
        </ErrorWrapper>
      </Suspense>
    </ThemeProvider>
  </React.StrictMode>
);
