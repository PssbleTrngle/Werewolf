import styled from "styled-components";
import { Button, Centered, Title } from "ui";
import { InvisibleLink } from "../components/Link";
import Layout from "../layout/default";
import Providers from "../lib/providers";
import { preloadTranslations } from "../lib/server/localization";

export const getStaticProps = preloadTranslations;

export default function NotFound() {
  return (
    <Providers>
      <Layout>
        <Centered>
          <Centered>
            <PageTitle>404 - Not Found</PageTitle>
            <InvisibleLink href="/">
              <Button>Take me back home</Button>
            </InvisibleLink>
          </Centered>
        </Centered>
      </Layout>
    </Providers>
  );
}

const PageTitle = styled(Title)`
  font-size: 3rem;
`;
