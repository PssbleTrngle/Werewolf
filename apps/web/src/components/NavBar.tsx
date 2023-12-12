import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  NavBar as Base,
  DocuIcon,
  HomeIcon,
  NavLinkStyle,
  NavTab,
  SettingsIcon,
  UserIcon,
  useActiveLink,
  useGameStatus,
} from "ui";
import ImpersonationSelect from "./ImpersonationSelect";

const LINKS: ReadonlyArray<NavTab> = [
  { key: "game", icon: <HomeIcon /> },
  { key: "players", icon: <UserIcon /> },
  { key: "roles", icon: <DocuIcon /> },
  { key: "settings", icon: <SettingsIcon /> },
].map((it) => ({
  ...it,
  path: `/${it.key}`,
}));

export default function NavBar() {
  const { t } = useTranslation("local");

  const location = useLocation();
  const active = useActiveLink(LINKS, location.pathname);
  const { data: status } = useGameStatus();

  return (
    <Base
      links={LINKS.map(({ key, path, icon }) => (
        <NavLink key={key} to={path} $active={active?.key === key}>
          <span>{t(`nav.${key}`)}</span>
          {icon}
        </NavLink>
      ))}
    >
      {status.type === "game" && <ImpersonationSelect />}
    </Base>
  );
}

const NavLink = styled(Link)<{ $active: boolean }>`
  ${NavLinkStyle}
`;
