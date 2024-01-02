import styled from "styled-components";
import { tooltip } from "ui";
import { useTranslation } from "react-i18next";

const impactColor = (value: number) => {
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
  background: ${(p) => impactColor(p.$value)};
  border-radius: 9999px;
`;

export default function ImpactBadge({
  value,
  ...props
}: Readonly<{ value: number }>) {
  const { t } = useTranslation();

  return (
    <Style $value={value} {...tooltip(t("role.impact"))} {...props}>
      {value > 0 ? `+${value}` : value}
    </Style>
  );
}
