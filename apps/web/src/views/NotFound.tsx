import { Button, Title } from "ui";
import InvisibleLink from "../components/InivisibleLink";

function NotFound() {
  return (
    <>
      <Title>404 - Page not found</Title>
      <InvisibleLink to="/">
        <Button>take me back home</Button>
      </InvisibleLink>
    </>
  );
}

export default NotFound;
