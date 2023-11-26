import { invert } from "polished";
import { PropsWithChildren, useMemo } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import styled from "styled-components";
import { Button } from "ui";

function ErrorPage({ error, resetErrorBoundary }: FallbackProps) {
  const realError = useMemo(
    () => (error instanceof Error ? error : new Error(error)),
    [error]
  );
  return (
    <Page>
      <Popup>
        <h1>An error occured!</h1>
        <p>{realError.message}</p>
        <small>
          {realError.stack
            ?.split("\n")
            ?.slice(1)
            .map((it, i) => <p key={`line-${i}`}>{it}</p>)}
        </small>
        <Button onClick={resetErrorBoundary}>Dismiss</Button>
      </Popup>
    </Page>
  );
}

export default function ErrorWrapper({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>{children}</ErrorBoundary>
  );
}

const Page = styled.section`
  display: grid;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;

  color: ${(p) => p.theme.text};
  background: ${(p) => invert(p.theme.text)};

  height: 100dvh;
`;

const Popup = styled.div`
  max-width: 800px;
`;
