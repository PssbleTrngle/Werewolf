import { useTranslation } from "react-i18next";
import type { Lobby } from "storage";
import styled from "styled-components";
import {
  Button,
  Buttons,
  Centered,
  IconButton,
  JoinIcon,
  tooltip,
  useCreateMutation,
} from "ui";
import Layout from "@/layout/default";
import { useJoinMutation, useLobbies } from "@/lib/client/remoteContext";

export default function NoGame() {
  const { mutate: create } = useCreateMutation();
  const { data: lobbies } = useLobbies();

  return (
    <Layout>
      <Centered>
        <LobbyTable>
          <tbody>
            {lobbies.map((it) => (
              <LobbyPanel key={it.id}>{it}</LobbyPanel>
            ))}
          </tbody>
        </LobbyTable>
        <Button onClick={() => create({})}>Create a game</Button>
      </Centered>
    </Layout>
  );
}

const LobbyTable = styled.table`
  border-collapse: collapse;
  text-align: left;

  td,
  th {
    padding: 0.5em;
  }
`;

function LobbyPanel({ children }: Readonly<{ children: Lobby }>) {
  const { t } = useTranslation("hub");
  const { mutate: join } = useJoinMutation(children.id);

  return (
    <tr>
      <td>{children.id}</td>
      <td>({children.players.length}/5)</td>
      <ButtonsCell>
        <IconButton {...tooltip(t("button.player.join"))}>
          <JoinIcon onClick={() => join()} />
        </IconButton>
      </ButtonsCell>
    </tr>
  );
}

const ButtonsCell = styled(Buttons).attrs({ as: "td" })`
  justify-content: end;
  ${IconButton} {
    font-size: 0.7em;
  }
`;
