import { Dispatch } from "react";
import { tooltip } from "ui";
import { ButtonProps } from "ui/src/components/Button";
import styled from "styled-components";
import { mix } from "polished";

export default function ToggleButton({
  disabledTooltip,
  value,
  onChange,
  ...props
}: Readonly<
  ButtonProps & {
    disabledTooltip?: string;
    value: boolean | undefined;
    onChange: Dispatch<boolean>;
  }
>) {
  return (
    <Style
      disabled={!!disabledTooltip}
      {...props}
      $active={value}
      onClick={() => onChange(!value)}
      {...tooltip(disabledTooltip)}
    />
  );
}

const Style = styled.button<{ $active?: boolean }>`
  cursor: pointer;

  border-radius: 1.6em;
  border: solid 2px ${(p) => p.theme.text};

  outline: none;
  background: ${(p) => (p.$active ? p.theme.accent : "transparent")};

  padding-block: 0.2em;
  padding-left: ${(p) => (p.$active ? "1.6em" : "0.2em")};
  padding-right: ${(p) => (p.$active ? "0.2em" : "1.6em")};

  transition:
    padding 0.2s ease,
    background 0.2s ease;

  &:after {
    content: "";
    display: block;
    height: 1.4em;
    width: 1.4em;
    background: ${(p) => p.theme.text};
    border-radius: 1.4em;
  }

  &:disabled {
    cursor: not-allowed;
    background: ${(p) =>
      p.$active ? mix(0.5, p.theme.bg, p.theme.text) : "transparent"};
  }
`;
