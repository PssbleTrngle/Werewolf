import { Link } from "react-router-dom";
import styled from "styled-components";
import { InvisibleLinkStyle } from "ui";

const InvisibleLink = styled(Link)`
  ${InvisibleLinkStyle}
`;

export default InvisibleLink;
