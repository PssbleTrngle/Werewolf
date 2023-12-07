import { Dispatch, FormEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button, Dialog, DialogProps, Input } from "ui";
import useDialog from "../../hooks/useDialog";

export default function RenameDialog({
  onChange,
  ...props
}: DialogProps &
  Readonly<{
    onChange: Dispatch<string>;
  }>) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const { render } = useDialog();

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
        <Input
          required
          placeholder={t("player.name")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button>{t("button.save")}</Button>
      </Form>
    </Dialog>
  );
}

const Form = styled.form`
  ${Button} {
    margin-left: 0.5em;
  }
`;
