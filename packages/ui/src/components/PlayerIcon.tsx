import { Player } from "models";
import { useTranslation } from "react-i18next";
import { styled } from "styled-components";

export default function PlayerIcon({
  children,
  size = 1,
  ...props
}: Readonly<{
  children: Player;
  size?: number;
}>) {
  const { t } = useTranslation();
  return (
    <Style $size={size} {...props}>
      {children.name}
      {children.role && (
        <Role title={t(`role.${children.role.type}.name`)}>
          {children.role.emoji}
        </Role>
      )}
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
