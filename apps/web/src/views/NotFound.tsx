import { Button, Centered, Title } from "ui";
import InvisibleLink from "../components/InivisibleLink";
import Layout from "./Layout";

function NotFound() {
  return (
    <Layout>
      <Centered>
        <Title>404 - Page not found</Title>
        <InvisibleLink to="/">
          <Button>take me back home</Button>
        </InvisibleLink>
      </Centered>
    </Layout>
  );
}

export default NotFound;
