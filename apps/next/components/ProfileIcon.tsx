import { useLocalStore } from "@/lib/client/store";
import { signIn, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "ui";

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
        <span>{session.user.name}</span>
        <Icon src={session.user.image} />
        {impersonated && (
          <Impersonated>
            {t("nav.impersonated", { user: impersonated })}
          </Impersonated>
        )}
      </Style>
    );
  }

  return null;
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

  font-size: 0.8em;
  text-align: center;
  margin-top: -0.5em;
`;

const Style = styled.div`
  display: grid;

  grid-template: "name icon";

  &:has(${Impersonated}) {
    grid-template:
      "name icon"
      "impersonated icon";
  }

  column-gap: 1em;
  padding: 0 0.5em;
  align-items: center;
`;
