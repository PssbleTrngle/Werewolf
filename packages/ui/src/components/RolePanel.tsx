import { Role, RoleGroup } from "models";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { tooltip } from "./Tooltip";

export const groupEmojis: Record<RoleGroup, string> = {
  [RoleGroup.GOOD]: "👍",
  [RoleGroup.EVIL]: "👎",
  [RoleGroup.VILLAGER]: "🌾",
  [RoleGroup.WOLF]: "🐺",
};

export default function RolePanel({
  role,
  small = false,
  ...props
}: Readonly<{ role?: Partial<Role>; small?: boolean }>) {
  const { t } = useTranslation();

  const name = useMemo(() => {
    if (role?.type)
      return t(`role.${role.type}.name`, { context: role.variant });
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

  if (small) {
    return (
      <Emoji {...props} {...tooltip(name)}>
        {emoji}
      </Emoji>
    );
  } else {
    return (
      <span {...props}>
        <Emoji>{emoji}</Emoji> {name}
      </span>
    );
  }
}

const Emoji = styled.span`
  cursor: default;
`;
