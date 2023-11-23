import { invert } from "polished";
import styled from "styled-components";

const Button = styled.button`
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

  transition: all 0.1s ease;
`;

export default Button;