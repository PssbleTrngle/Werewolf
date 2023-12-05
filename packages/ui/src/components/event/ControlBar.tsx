import { EventQueue } from "models";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  useGameInfo,
  useRedoMutation,
  useUndoMutation,
} from "../../hooks/queries";
import { RedoIcon, UndoIcon } from "../../icons";
import { Buttons, IconButton } from "../Button";

function times<T>(amount: number, factory: (i: number) => T) {
  return new Array(amount).fill(null).map((_, i) => factory(i));
}

function Queue({ children }: Readonly<{ children: EventQueue }>) {
  const sliced = useMemo(() => {
    const past = Math.min(children.past, 5);
    const unknownFuture = Math.min(children.unknownFuture, 5);
    const future = children.writtenFuture + unknownFuture;
    return { ...children, past, future, unknownFuture };
  }, [children]);

  const offset = useMemo(() => sliced.future - sliced.past, [sliced]);

  return (
    <Blobs $offset={offset}>
      <TinyBlob />

      {times(sliced.past, (i) => (
        <PastBlob key={`past-${i}`} />
      ))}
      <CurrentBlob key="current" />
      {times(sliced.writtenFuture, (i) => (
        <PastBlob key={`written-future-${i}`} />
      ))}
      {times(sliced.unknownFuture, (i) => (
        <Blob key={`unknown-future-${i}`} />
      ))}

      <TinyBlob />
    </Blobs>
  );
}

export default function ControlBar() {
  const { t } = useTranslation();
  const { data: status } = useGameInfo();
  const { mutate: undo } = useUndoMutation();
  const { mutate: redo } = useRedoMutation();

  const isModerator = useMemo(() => !!status?.queue, [status]);

  const canUndo = useMemo(() => (status?.queue?.past ?? 0) > 0, [status]);

  const canRedo = useMemo(
    () => (status?.queue?.writtenFuture ?? 0) > 0,
    [status]
  );

  if (!isModerator) return null;

  return (
    <Style>
      {status?.queue && <Queue>{status.queue}</Queue>}
      <Buttons>
        <IconButton disabled={!canUndo} onClick={undo} title={t("button.undo")}>
          <UndoIcon />
        </IconButton>
        <IconButton disabled={!canRedo} onClick={redo} title={t("button.redo")}>
          <RedoIcon />
        </IconButton>
      </Buttons>
    </Style>
  );
}

const Style = styled.section`
  padding: 1em;
`;

const Blobs = styled.div<{ $offset: number }>`
  font-size: 0.5em;

  display: grid;
  grid-template-columns: repeat(auto-fit, 1em);
  height: 1em;
  margin-bottom: 1.5em;
  gap: 0.5em;

  justify-content: center;
  width: 100%;

  transform: translateX(${(p) => (p.$offset * 1.5) / 2}em);
  transition: transform 0.2s ease;
`;

const Blob = styled.div`
  border-radius: 9999px;
  background: ${(p) => p.theme.text};
`;

const CurrentBlob = styled(Blob)`
  background: ${(p) => p.theme.accent};
`;

const PastBlob = styled(Blob)`
  opacity: 0.5;
`;

const TinyBlob = styled(PastBlob)`
  margin: 0.25em;
`;
