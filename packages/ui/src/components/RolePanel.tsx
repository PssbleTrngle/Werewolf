import { Role, RoleGroup } from "models";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { tooltip } from "./Tooltip";

export const groupEmojis: Record<RoleGroup, string> = {
  villager: "🌾",
  wolf: "🐺",
};

export default function RolePanel({
  role,
  variant,
  small = false,
  ...props
}: Readonly<{ role?: Partial<Role>; variant?: string; small?: boolean }>) {
  const { t } = useTranslation();

  const name = useMemo(() => {
    if (role?.type) return t(`role.${role.type}.name`, { context: variant });
    if (role?.groups) return t(`role.group.${role.groups[0] ?? "unknown"}`);
    return undefined;
  }, [variant, t, role]);

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
      <span {...props} {...tooltip(name)}>
        {emoji}
      </span>
    );
  } else {
    return (
      <span {...props}>
        {emoji} {name}
      </span>
    );
  }
}