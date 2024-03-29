import { FakeData } from "models";
import { ReactNode, createElement, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Title } from "../Text";
import DeathDetails from "./detail/DeathDetails";
import FakeDetails from "./detail/FakeDetails";
import RevealDetail from "./detail/RevealDetails";
import WinDetails from "./detail/WinDetails";

function baseType(type: string) {
  const [base] = type.split(".");
  return base;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DetailProps<T = any> = Readonly<{
  data: T;
  createTitle: (props?: Record<string, unknown>) => ReactNode;
}>;
const details: Record<string, (props: DetailProps) => ReactNode> = {
  reveal: RevealDetail,
  announcement: DeathDetails,
  win: WinDetails,
  fake: FakeDetails,
};

export default function EventDetails({ event }: { event: FakeData }) {
  const { t } = useTranslation();
  const type = useMemo(() => baseType(event.type), [event]);
  const component = useMemo(() => details[type], [type]);

  const createTitle = useCallback<DetailProps["createTitle"]>(
    (args) => <Title>{t(`event.${event.type}.title`, args)}</Title>,
    [event, t],
  );

  return component
    ? createElement(component, { data: event.data, createTitle })
    : createTitle();
}
