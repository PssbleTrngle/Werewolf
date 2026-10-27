import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled, { css } from "styled-components";
import { Tooltip } from "ui";
import type { SelectedHint } from "../../hooks/hints";

export default function Hint({ hint }: Readonly<{ hint: SelectedHint }>) {
  const { t } = useTranslation("local");

  const hintContent = useMemo(
    () => (
      <HintContent>
        {hint.icon}
        <span>{t(hint.translation)}</span>
      </HintContent>
    ),
    [hint, t],
  );

  return hint.target ? (
    <HintTooltip
      anchorSelect={hint.target}
      render={() => hintContent}
      key={`${hint.target}-tooltip`}
    />
  ) : (
    <GlobalHint>{hintContent}</GlobalHint>
  );
}

const HintStyles = css`
  z-index: 1000;
  background: ${(p) => p.theme.accent} !important;
`;

const HintTooltip = styled(Tooltip).attrs({
  id: "guide-tooltip",
  imperativeModeOnly: true,
  isOpen: true,
  offset: 20,
})`
  ${HintStyles};
`;

const HintContent = styled.div`
  display: grid;
  grid-template-columns: 1em 1fr;
  align-items: center;
  gap: 0.5em;

  min-width: 200px;
  width: max-content;
  max-width: 90dvw;
`;

const GlobalHint = styled.p`
  background: ${(p) => p.theme.accent};

  padding: 0.5em;
  text-align: center;
  border-radius: 3px;
  position: absolute;

  top: 5em;
  left: 50%;
  transform: translateX(-50%);

  ${HintStyles};
`;
