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
  ...props
}: Readonly<PropsWithChildren<AppInfo>>) {
  const { t } = useTranslation();

  return (
    <Style {...props}>
      <span>{children}</span>
      <VersionInfo {...props} />
      <Icons>
        {props.repository && (
          <IconLink
            href={`https://github.com/${props.repository}`}
            title={t("button.source")}
          >
            <GithubIcon />
          </IconLink>
        )}
        <IconLink
          href="https://weblate.macarena.ceo/engage/werewolf"
          title={t("button.translate")}
        >
          <WeblateIcon />
        </IconLink>
      </Icons>
    </Style>
  );
}

function VersionInfo({ sha, version, repository }: AppInfo) {
  return (
    <Centered>
      <span>{repository}@</span>
      <Link href={`https://github.com/${repository}/tree/${sha}`}>
        {version}
      </Link>
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
