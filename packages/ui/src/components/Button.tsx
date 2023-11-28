import { invert, lighten } from "polished";
import styled, { css } from "styled-components";

const ErrorStyle = css`
  background: #b53149;

  &:hover:not(:disabled) {
    background: ${lighten(0.1, "#b53149")};
    color: #eee;
  }
`;

const Button = styled.button<{ error?: boolean }>`
  border: none;
  outline: none;
  cursor: pointer;

  color: inherit;

  padding: 1em 2em;

  border: solid 2px ${(p) => p.theme.text};
  background: transparent;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.text};
    color: ${(p) => invert(p.theme.text)};
  }

  &:focus:not(:disabled) {
    border-color: ${(p) => p.theme.accent};
    box-shadow: 0 0 0 2px ${(p) => p.theme.accent};
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }

  ${(p) => p.error && ErrorStyle}

  transition: all 0.2s ease;
`;

export default Button;
