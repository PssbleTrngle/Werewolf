import { Dispatch } from "react";
import { DisabledIcon, EnabledIcon, IconButton, tooltip } from "ui";
import { ButtonProps } from "ui/src/components/Button";

export default function ToggleButton({
  disabledTooltip,
  value,
  onChange,
  ...props
}: Readonly<
  ButtonProps & {
    disabledTooltip?: string;
    value: boolean | undefined;
    onChange: Dispatch<boolean>;
  }
>) {
  return (
    <IconButton
      disabled={!!disabledTooltip}
      {...props}
      onClick={() => onChange(!value)}
      {...tooltip(disabledTooltip)}
    >
      {value ? <EnabledIcon /> : <DisabledIcon />}
    </IconButton>
  );
}
