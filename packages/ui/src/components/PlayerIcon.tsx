import { Player, RoleGroup } from "models";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { tooltip } from "..";

const groupEmojis: Record<RoleGroup, string> = {
  villager: "🌾",
  wolf: "🐺",
};

export default function PlayerIcon({
  children: { name, role },
  size = 1,
  ...props
}: Readonly<{
  children: Player;
  size?: number;
}>) {
  const { t } = useTranslation();

  const roleTooltip = useMemo(() => {
    if (role?.type) return t(`role.${role.type}.name`);
    if (role?.groups) return t(`role.group.${role.groups[0] ?? "unknown"}`);
    return undefined;
  }, [t, role]);

  const emoji = useMemo(() => {
    if (role?.emoji) return role.emoji;
    if (role?.groups) {
      if (role.groups.length === 0) return `❔`;
      const group = role.groups[0];
      return groupEmojis[group] ?? `[${group.at(0)?.toUpperCase()}]`;
    }
    return undefined;
  }, [role]);

  return (
    <Style $size={size} {...props}>
      {name}
      {emoji && <Role {...tooltip(roleTooltip)}>{emoji}</Role>}
    </Style>
  );
}

const Style = styled.span<{ $size: number }>`
  font-size: ${(p) => p.$size}em;

  border-radius: 0.2em;
  outline: 2px solid transparent;
  padding: 0.3em;

  &:hover {
    outline-color: ${(p) => p.theme.text};
  }

  transition: outline 0.1s linear;
`;

const Role = styled.span`
  margin-left: 0.25em;
`;
