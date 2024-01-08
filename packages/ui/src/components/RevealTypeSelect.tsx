import { PlayerRevealType } from "models";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "./Input";

const REVEAL_TYPES: PlayerRevealType[] = [
  PlayerRevealType.ROLE,
  PlayerRevealType.GROUP,
  PlayerRevealType.ALIGNMENT,
  PlayerRevealType.NOTHING,
];

export default function RevealTypeSelect({
  value,
  onChange,
  ...props
}: Readonly<{
  id?: string;
  value: PlayerRevealType | undefined;
  onChange: Dispatch<PlayerRevealType>;
}>) {
  const { t } = useTranslation();

  return (
    <Select
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value as PlayerRevealType)}
    >
      {REVEAL_TYPES.map((type) => (
        <option key={type} value={type}>
          {t(`settings.reveal_type.${type}`)}
        </option>
      ))}
    </Select>
  );
}
