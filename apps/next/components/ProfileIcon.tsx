import ImpersonateControl from "@/components/ImpersonateControl";
import { useLocalStore } from "@/lib/client/store";
import { signIn, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button, useGameStatus } from "ui";

export default function ProfileIcon() {
  const { t } = useTranslation("hub");
  const { data: session, status } = useSession();
  const impersonated = useLocalStore((it) => it.impersonated);

  if (status === "unauthenticated") {
    return <Button onClick={() => signIn()}>Login</Button>;
  }

  if (status === "authenticated") {
    return (
      <Style>
        <OptionalImpersonateControl />
        <span>{session.user.name}</span>
        <Icon src={session.user.image} />
        {impersonated && (
          <Impersonated>
            {t("nav.impersonated", { user: impersonated.name })}
          </Impersonated>
        )}
      </Style>
    );
  }

  return null;
}

function OptionalImpersonateControl() {
  const { data: status } = useGameStatus();
  if (status.type === "game") {
    return <ImpersonateControl gameId={status.id} />;
  } else {
    return null;
  }
}

const Icon = styled.img`
  grid-area: icon;

  height: 2em;
  width: 2em;
  object-fit: cover;
  border-radius: 9999px;
`;

const Impersonated = styled.i`
  grid-area: impersonated;
  opacity: 0.7;

  font-size: 0.7em;
  margin-top: -0.5em;
`;

const Style = styled.div`
  display: grid;
  text-align: center;

  grid-template: "impersonate name icon";

  &:has(${Impersonated}) {
    grid-template:
      "impersonate name icon"
      "impersonate impersonated icon";
  }

  column-gap: 1em;
  padding: 0 0.5em;
  align-items: center;
`;
