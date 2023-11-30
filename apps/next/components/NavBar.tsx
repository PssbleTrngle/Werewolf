import NextLink from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { NavBar as Base, NavLink, NavLinkStyle, useIsActive } from "ui";

const LINKS: ReadonlyArray<NavLink> = [
  { key: "home", path: "/" },
  { key: "game" },
].map((it) => ({
  path: `/${it.key}`,
  ...it,
}));

export default function NavBar() {
  const { t } = useTranslation();

  const { pathname } = useRouter();
  const isActive = useIsActive(pathname);

  return (
    <Base
      links={LINKS.map(({ key, path }) => (
        <NavLink key={key} href={path} $active={isActive(path)}>
          <span>{t(`nav.${key}`)}</span>
        </NavLink>
      ))}
    />
  );
}

const NavLink = styled(NextLink)<{ $active: boolean }>`
  ${NavLinkStyle}
`;
