import { invert, lighten } from "polished";
import styled, { ShouldForwardProp, css } from "styled-components";
import { RuleSet } from "styled-components/dist/types";
import { InputStyles } from "./Input";

export interface ButtonProps {
  error?: boolean;
  primary?: boolean;
  selected?: boolean;
  id?: string;
}

export const hoverAndSelect = (
  styles: RuleSet<ButtonProps>
) => css<ButtonProps>`
  &&:not(:disabled) {
    &:hover {
      ${styles}
    }

    ${(p) => p.selected && styles};
  }
`;

const ErrorStyle = css`
  background: ${(p) => p.theme.error};
  border-color: ${(p) => lighten(0.2, p.theme.error)};

  ${hoverAndSelect(css`
    background: ${(p) => lighten(0.1, p.theme.error)};
    color: #eee;
  `)}
`;

const PrimaryStyle = css`
  background: ${(p) => p.theme.accent};
  border-color: ${(p) => lighten(0.2, p.theme.accent)};

  ${hoverAndSelect(css`
    background: ${(p) => lighten(0.1, p.theme.accent)};
    color: #eee;
  `)}
`;

const shouldForwardProp: ShouldForwardProp<"web"> = (key) => {
  return key !== "error" && key !== "primary" && key !== "selected";
};

const Button = styled.button.withConfig({ shouldForwardProp })<ButtonProps>`
  ${InputStyles};

  background: transparent;
  cursor: pointer;
  padding: 1em 2em;

  ${hoverAndSelect(css`
    background: ${(p) => p.theme.text};
    color: ${(p) => invert(p.theme.text)};
  `)}

  ${(p) => p.error && ErrorStyle}
    ${(p) => p.primary && PrimaryStyle}
`;

export const IconButton = styled(Button)`
  padding: 0.3em 0.8em;

  display: flex;
  align-items: center;
  gap: 0.5em;

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
