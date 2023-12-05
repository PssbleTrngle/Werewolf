import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  NavBar as Base,
  NavLinkStyle,
  NavTab,
  useActiveLink,
  useGameStatus,
} from "ui";
import ImpersonationSelect from "./ImpersonationSelect";

const LINKS: ReadonlyArray<NavTab> = [
  { key: "game" },
  { key: "players" },
  { key: "roles" },
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
      links={LINKS.map(({ key, path }) => (
        <NavLink key={key} to={path} $active={active?.key === key}>
          <span>{t(`nav.${key}`)}</span>
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
