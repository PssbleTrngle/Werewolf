import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Dialog, Loading, useRoles } from "ui";
import { useLocalStore } from "../hooks/store";

export default function TagDataProcessor({
  data,
}: Readonly<{
  data: Record<string, string>;
}>) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: roles } = useRoles();
  const { modifyPlayer, savedRoleDialog, saveRoleDialog } = useLocalStore();

  const close = useCallback(() => {
    navigate({ search: "" }, { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!roles) return;

    if (savedRoleDialog && "role" in data) {
      const role = roles.find((it) => it.type === data.role);
      if (role) modifyPlayer(savedRoleDialog, { role });
    }

    saveRoleDialog();
    close();
  }, [roles, data, close, savedRoleDialog, saveRoleDialog, modifyPlayer]);

  return (
    <Dialog visible onClose={close}>
      <h2>{t("local:dialog.nfc")}</h2>
      <Loading />
    </Dialog>
  );
}
