import { mix } from "polished";
import styled, { css } from "styled-components";

export const InputStyles = css`
  border: none;
  outline: none;

  color: inherit;

  padding: 1em;

  border: solid 2px ${(p) => p.theme.text};
  background: ${(p) => mix(0.2, "#777", p.theme.bg)};

  &:hover:not(:disabled) {
    background: ${(p) => mix(0.3, "#777", p.theme.bg)};
  }

  &:focus:not(:disabled) {
    border-color: ${(p) => p.theme.accent};
    box-shadow: 0 0 0 2px ${(p) => p.theme.accent};
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }

  transition: all 0.1s ease;
`;

const Input = styled.input`
  ${InputStyles};
`;

export default Input;
