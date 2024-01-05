import styled from "styled-components";
import { tooltip } from "ui";
import { useTranslation } from "react-i18next";
import { lighten, transparentize } from "polished";

export const stringifyImpact = (value: number) =>
  value > 0 ? `+${value}` : `${value}`;

export const impactColor = (value: number) => {
  if (value === 0) return "#20adba";
  if (value < -2) return "#c0492e";
  if (value < 0) return "#c0702e";
  if (value > 2) return "#60ba20";
  return "#8c9a0b";
};

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
