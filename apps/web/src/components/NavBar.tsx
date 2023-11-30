import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { NavBar as Base, NavLink, NavLinkStyle, useIsActive } from "ui";
import ImpersonationSelect from "./ImpersonationSelect";

const LINKS: ReadonlyArray<NavLink> = [
  { key: "game" },
  { key: "players" },
  { key: "roles" },
].map((it) => ({
  ...it,
  path: `/${it.key}`,
}));

export default function NavBar() {
  const { t } = useTranslation();

  const location = useLocation();
  const isActive = useIsActive(location.pathname);

  return (
    <Base
      links={LINKS.map(({ key, path }) => (
        <NavLink key={key} to={path} $active={isActive(path)}>
          <span>{t(`nav.${key}`)}</span>
        </NavLink>
      ))}
    >
      <ImpersonationSelect />
    </Base>
  );
}

const NavLink = styled(Link)<{ $active: boolean }>`
  ${NavLinkStyle}
`;
