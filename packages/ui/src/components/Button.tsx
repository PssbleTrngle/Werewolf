import { invert, lighten } from "polished";
import styled, { css } from "styled-components";
import { InputStyles } from "./Input";

const ErrorStyle = css`
  background: #b53149;

  &:hover:not(:disabled) {
    background: ${lighten(0.1, "#b53149")};
    color: #eee;
  }
`;

const Button = styled.button<{ $error?: boolean }>`
  ${InputStyles};

  background: transparent;
  cursor: pointer;
  padding: 1em 2em;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.text};
    color: ${(p) => invert(p.theme.text)};
  }

  ${(p) => p.$error && ErrorStyle}
`;

export const IconButton = styled(Button)`
  padding: 0.3em 0.8em;

  svg {
    height: 2.2em;
  }
`;

export const Buttons = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
`;

export default Button;
