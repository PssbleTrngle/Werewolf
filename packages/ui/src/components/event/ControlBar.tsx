import { EventQueue } from "models";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  useGameStatus,
  useRedoMutation,
  useUndoMutation,
} from "../../hooks/game";
import Button from "../Button";

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

  const { data: status } = useGameStatus();
  const { mutate: undo } = useUndoMutation();
  const { mutate: redo } = useRedoMutation();

  const canUndo = useMemo(() => (status?.queue?.past ?? 0) > 0, [status]);

  const canRedo = useMemo(
    () => (status?.queue?.writtenFuture ?? 0) > 0,
    [status]
  );

  return (
    <Style>
      {status?.queue && <Queue>{status.queue}</Queue>}
      <Button disabled={!canUndo} onClick={undo}>
        {t("button.undo")}
      </Button>
      <Button disabled={!canRedo} onClick={redo}>
        {t("button.redo")}
      </Button>
    </Style>
  );
}

const Style = styled.section`
  padding: 1em;
  ${Button} {
    margin: 0 0.5em;
  }
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
