import { mix } from "polished";
import { useMemo } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import styled from "styled-components";
import { Button, Centered, Title } from "ui";
import InvisibleLink from "../components/InivisibleLink";
import { appInfo } from "../lib/appInfo";
import Layout from "./Layout";
import NotFound from "./NotFound";

export default function ErrorView() {
  return (
    <Layout>
      <Centered>
        <ErrorMessage />
      </Centered>
    </Layout>
  );
}

function ErrorMessage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <NotFound />;
  }

  const message =
    error instanceof Error ? error.message : "unable to display error message";

  return (
    <>
      <Title>Unexpected error occurred</Title>
      <Trace>
        <code>{message}</code>
      </Trace>
      <ReportButton />
    </>
  );
}

function ReportButton() {
  const error = useRouteError();

  const query = useMemo(() => {
    const params = new URLSearchParams();

    params.set("template", "bug_report.yaml");

    if (appInfo.version) {
      params.set("version", appInfo.version);
    }

    if (error instanceof Error) {
      params.set("title", error.message);

      if (error.stack) params.set("stack", error.stack);
    }

    return `?` + params.toString();
  }, [error]);

  if (!appInfo.repository) return null;

  return (
    <InvisibleLink
      to={`https://github.com/${appInfo.repository}/issues/new${query}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button>Submit issue</Button>
    </InvisibleLink>
  );
}

const Trace = styled.pre`
  background: ${(p) => mix(0.8, p.theme.bg, p.theme.text)};
  padding: 1em;
`;
