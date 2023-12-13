import styled from "styled-components";
import { FOOTER_HEIGHT, Loading } from "ui";
import Layout from "../views/Layout";

export default function LoadingPage() {
  return (
    <Layout>
      <Style />
    </Layout>
  );
}

const Style = styled(Loading)`
  height: calc(100dvh - ${FOOTER_HEIGHT}px);
`;
