import { mix } from "polished";
import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { XS } from "ui";

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
  const location = useLocation();
  const isActive = useCallback(
    (path: string) => location.pathname.startsWith(path),
    [location]
  );

  return (
    <Style>
      {LINKS.map(({ key, path }) => (
        <NavLink key={key} to={path} $active={isActive(path)}>
          <span>{key}</span>
        </NavLink>
      ))}
    </Style>
  );
}

const Style = styled.nav`
  grid-area: nav;

  display: grid;
  grid-template-columns: repeat(${LINKS.length}, 120px);

  background-color: ${(p) => p.theme.nav};

  ${XS} {
    grid-template-columns: repeat(${LINKS.length}, 1fr);
  }
`;

const ActiveLink = css`
  border-bottom-color: ${(p) => p.theme.accent};
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  text-decoration: none;
  text-align: center;
  text-transform: capitalize;
  font-family: sans-serif;

  padding: 1em;

  ${XS} {
    padding: 2em;
  }

  background-color: ${(p) => p.theme.nav};
  color: ${(p) => p.theme.text};
  border-bottom: solid 2px ${(p) => p.theme.nav};

  ${(p) => p.$active && ActiveLink}

  &:hover {
    background: ${(p) => mix(0.1, "#777", p.theme.nav)};
  }

  transition:
    background 0.1s linear,
    border 0.1s linear;
`;
