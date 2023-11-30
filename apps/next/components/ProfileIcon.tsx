import { signIn, useSession } from "next-auth/react";
import styled from "styled-components";
import { Button } from "ui";

export default function ProfileIcon() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return <Button onClick={() => signIn()}>Login</Button>;
  }

  if (status === "authenticated") {
    return (
      <Style>
        <span>{session.user.name}</span>
        <Icon src={session.user.image} />
      </Style>
    );
  }

  return <span>...</span>;
}

const Style = styled.div`
  display: flex;
  gap: 1em;
  padding: 0 0.5em;
  align-items: center;
`;

const Icon = styled.img`
  height: 2em;
  width: 2em;
  object-fit: cover;
  border-radius: 9999px;
`;
