import { Dispatch, FormEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button, Buttons, Dialog, DialogProps, Input } from "ui";
import useDialog from "../../hooks/useDialog";

export default function RenameDialog({
  onChange,
  initial = "",
  ...props
}: DialogProps &
  Readonly<{
    onChange: Dispatch<string>;
    initial?: string;
  }>) {
  const { t } = useTranslation();
  const [value, setValue] = useState(initial);
  const { render } = useDialog();

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const submit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      onChange(value);
      setValue("");
    },
    [onChange, value, setValue]
  );

  return render(
    <Dialog {...props}>
      <Form onSubmit={submit}>
        <h2>{t("local:dialog.rename")}</h2>
        <NameInput
          required
          placeholder={t("player.name")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <DialogButtons>
          <Button primary>{t("button.save")}</Button>
          <Button onClick={props.onClose}>{t("button.cancel")}</Button>
        </DialogButtons>
      </Form>
    </Dialog>
  );
}

const DialogButtons = styled(Buttons)`
  grid-template-columns: repeat(2, 1fr);
`;

const NameInput = styled(Input)`
  width: calc(100% - 2em);
  width: 240px;
  max-width: 95vw;
`;

const Form = styled.form`
  position: relative;
`;
