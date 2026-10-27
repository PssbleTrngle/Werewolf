import { lighten, transparentize } from "polished";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { tooltip } from "ui";
import { impactColor, stringifyImpact } from "../lib/impact";

const Style = styled.span<{ $value: number }>`
  cursor: default;
  display: inline-block;

  min-width: 1.2em;
  text-align: center;

  padding: 0.5em;
  text-shadow: black 0 0 5px;
  background: linear-gradient(
    170deg,
    ${(p) => lighten(0.2, impactColor(p.$value))},
    ${(p) => impactColor(p.$value)},
    ${(p) => transparentize(0.8, impactColor(p.$value))}
  );
  border-radius: 9999px;
`;

export default function ImpactBadge({
  value,
  ...props
}: Readonly<{ value: number }>) {
  const { t } = useTranslation();

  return (
    <Style $value={value} {...tooltip(t("role.impact"))} {...props}>
      {stringifyImpact(value)}
    </Style>
  );
}
