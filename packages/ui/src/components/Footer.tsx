import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { GithubIcon, WeblateIcon } from "../icons";
import { InvisibleLinkStyle, LinkStyle } from "../styles/links";
import { XS } from "../styles/screens";

export const FOOTER_HEIGHT = 60;

export interface AppInfo {
  readonly sha?: string;
  readonly version?: string;
  readonly repository?: string;
}

export default function Footer({
  children,
  sha,
  version,
  repository,
  ...props
}: Readonly<PropsWithChildren<AppInfo>>) {
  const { t } = useTranslation();

  return (
    <Style {...props}>
      <span>{children}</span>
      <VersionInfo sha={sha} version={version} repository={repository} />
      <Icons>
        {repository && (
          <IconLink
            href={`https://github.com/${repository}`}
            data-tooltip-id="tooltip"
            data-tooltip-content={t("button.source")}
          >
            <GithubIcon />
          </IconLink>
        )}
        <IconLink
          href="https://weblate.macarena.ceo/engage/werewolf"
          data-tooltip-id="tooltip"
          data-tooltip-content={t("button.translate")}
        >
          <WeblateIcon />
        </IconLink>
      </Icons>
    </Style>
  );
}

function VersionInfo({ sha, version, repository }: AppInfo) {
  if (!repository) return <span />;
  return (
    <Centered>
      <span>{repository}</span>
      {version && (
        <>
          <span>@</span>
          {sha ? (
            <Link href={`https://github.com/${repository}/tree/${sha}`}>
              {version}
            </Link>
          ) : (
            <span>{version}</span>
          )}
        </>
      )}
    </Centered>
  );
}

const Icons = styled.ul`
  font-size: 1.5em;
  text-align: right;

  svg {
    margin-right: 0.6em;
    height: 1em;
  }
`;

const Centered = styled.span`
  text-align: center;
`;

const IconLink = styled.a`
  ${InvisibleLinkStyle};

  &:hover {
    ${LinkStyle};
  }
`;

const Link = styled.a`
  ${LinkStyle}
`;

const Style = styled.footer`
  grid-area: footer;

  font-size: 0.8rem;

  background-color: ${(p) => p.theme.nav};

  padding: 0.2em 0;
  border-top: solid 0.3em ${(p) => p.theme.bg};

  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-columns: 1fr 1fr 1fr;

  ${XS} {
    display: none;
  }
`;
