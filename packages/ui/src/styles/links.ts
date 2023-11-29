import { css } from "styled-components";

export const InvisibleLinkStyle = css`
  text-decoration: none;
  color: ${(p) => p.theme.text};
`;

export const LinkStyle = css`
  color: ${(p) => p.theme.accent};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
