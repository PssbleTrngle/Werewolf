import { mix } from "polished";
import { PropsWithChildren, ReactNode, useMemo } from "react";
import styled, { css } from "styled-components";
import { InvisibleLinkStyle } from "../styles/links";
import { XS } from "../styles/screens";

export interface NavTab {
  key: string;
  path: string;
  icon?: ReactNode;
}

function isActive({ path }: NavTab, pathname: string) {
  if (path === "/") return path === pathname;
  return pathname.startsWith(path);
}

export function useActiveLink(links: ReadonlyArray<NavTab>, pathname: string) {
  return useMemo(() => {
    return links.find((it) => isActive(it, pathname));
  }, [pathname, links]);
}

export function NavBar({
  links,
  children,
}: Readonly<
  PropsWithChildren<{
    links: ReadonlyArray<ReactNode>;
  }>
>) {
  return (
    <Style>
      <Links $count={links.length}>{links}</Links>
      {children}
    </Style>
  );
}

// TODO solution without $count
const Links = styled.nav<{ $count: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$count}, 120px);

  ${XS} {
    grid-template-columns: repeat(${(p) => p.$count}, 1fr);
  }
`;

export const MOBILE_NAV_HEIGHT = "5em";

const Style = styled.section`
  grid-area: nav;

  display: grid;
  grid-template-columns: 1fr auto;

  background-color: ${(p) => p.theme.nav};

  ${XS} {
    height: ${MOBILE_NAV_HEIGHT};
    grid-template-columns: 1fr;

    box-shadow: 0 -0.5em 0.5em 0 ${(p) => p.theme.bg};

    align-items: start;

    select {
      display: none;
    }
  }
`;

const ActiveLink = css`
  border-bottom-color: ${(p) => p.theme.accent};

  ${XS} {
    color: ${(p) => p.theme.accent};
  }
`;

export const NavLinkStyle = css<{ $active: boolean }>`
  ${InvisibleLinkStyle};

  text-align: center;

  padding: 1em;

  svg {
    display: none;
  }

  background-color: ${(p) => p.theme.nav};
  border-bottom: solid 2px ${(p) => p.theme.nav};

  &:hover {
    background: ${(p) => mix(0.1, "#777", p.theme.nav)};
  }

  ${(p) => p.$active && ActiveLink}

  ${XS} {
    padding: 0;
    padding-top: 0.5em;
    display: grid;
    border-width: 0px;

    grid-template: "icon" "title";
    gap: 0.2em;

    &:has(svg) span {
      text-align: center;
      font-size: 0.5em;
    }

    &:hover {
      background: ${(p) => p.theme.nav};
    }

    svg {
      justify-self: center;
      grid-area: icon;
      display: initial;
      height: 2em;
    }
  }

  transition:
    background 0.1s linear,
    border 0.1s linear;
`;
