import { mix } from "polished";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { XS } from "ui";
import ImpersonationSelect from "./ImpersonationSelect";
import InvisibleLink from "./InivisibleLink";

interface NavLink {
  key: string;
  path: string;
}

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
  const isActive = useCallback(
    (path: string) => location.pathname.startsWith(path),
    [location]
  );

  return (
    <Style>
      <Links>
        {LINKS.map(({ key, path }) => (
          <NavLink key={key} to={path} $active={isActive(path)}>
            <span>{t(`nav.${key}`)}</span>
          </NavLink>
        ))}
      </Links>
      <ImpersonationSelect />
    </Style>
  );
}

const Links = styled.nav`
  display: grid;
  grid-template-columns: repeat(${LINKS.length}, 120px);

  ${XS} {
    grid-template-columns: repeat(${LINKS.length}, 1fr);
  }
`;

const Style = styled.section`
  grid-area: nav;

  display: grid;
  grid-template-columns: 1fr auto;

  background-color: ${(p) => p.theme.nav};

  ${XS} {
    grid-template-columns: 1fr;

    select {
      display: none;
    }
  }
`;

const ActiveLink = css`
  border-bottom-color: ${(p) => p.theme.accent};
`;

const NavLink = styled(InvisibleLink)<{ $active: boolean }>`
  text-align: center;

  padding: 1em;

  ${XS} {
    padding: 2em;
  }

  background-color: ${(p) => p.theme.nav};
  border-bottom: solid 2px ${(p) => p.theme.nav};

  ${(p) => p.$active && ActiveLink}

  &:hover {
    background: ${(p) => mix(0.1, "#777", p.theme.nav)};
  }

  transition:
    background 0.1s linear,
    border 0.1s linear;
`;
