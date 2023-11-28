import { Link } from "react-router-dom";
import styled from "styled-components";

const InvisibleLink = styled(Link)`
  text-decoration: none;
  color: ${(p) => p.theme.text};
`;

export default InvisibleLink;
