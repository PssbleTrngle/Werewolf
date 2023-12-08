import styled from "styled-components";
import { ErrorIcon } from "../icons";

export default function ErrorMessage({
  error,
}: Readonly<{ error?: Error | string | null }>) {
  if (!error) return null;
  const message = typeof error === "string" ? error : error.message;
  return (
    <Style>
      <Icon />
      <Message>{message}</Message>
    </Style>
  );
}

const Icon = styled(ErrorIcon)`
  height: 2em;
  padding: 0.5em;
  background: ${(p) => p.theme.error};
`;

const Style = styled.p`
  margin: 1em 0;
  color: #eee;

  border: 2px solid ${(p) => p.theme.error};
  background: linear-gradient(
    to right,
    ${(p) => p.theme.error} 20%,
    transparent 90%
  );

  display: grid;
  grid-template-columns: 1em 1fr;
  gap: 1em;

  justify-content: center;
  align-items: center;
`;

const Message = styled.span`
  padding: 0 2em;
`;
