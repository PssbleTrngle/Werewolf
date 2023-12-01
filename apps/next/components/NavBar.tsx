import NextLink from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { NavBar as Base, NavLinkStyle, NavTab, useActiveLink } from "ui";
import ProfileIcon from "./ProfileIcon";

const LINKS: ReadonlyArray<NavTab> = [
  { key: "home", path: "/" },
  { key: "game" },
].map((it) => ({
  path: `/${it.key}`,
  ...it,
}));

export default function NavBar() {
  const { t } = useTranslation("hub");

  const { pathname } = useRouter();
  const active = useActiveLink(LINKS, pathname);

  return (
    <Base
      links={LINKS.map(({ key, path }) => (
        <NavLink key={key} href={path} $active={active?.key === key}>
          <span>{t(`nav.${key}`)}</span>
        </NavLink>
      ))}
    >
      <ProfileIcon />
    </Base>
  );
}

const NavLink = styled(NextLink)<{ $active: boolean }>`
  ${NavLinkStyle}
`;
