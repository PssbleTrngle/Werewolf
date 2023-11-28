import styled from "styled-components";

export default function ErrorMessage({
  error,
}: Readonly<{ error?: Error | null }>) {
  if (!error) return null;
  return <Style>{error?.message}</Style>;
}

const Style = styled.span`
  margin: 0.5em 0;
  color: #b53149;
`;
