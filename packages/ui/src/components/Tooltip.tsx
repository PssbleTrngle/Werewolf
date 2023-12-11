import { Tooltip as ReactTooltip } from "react-tooltip";
import styled from "styled-components";

const Tooltip = styled(ReactTooltip).attrs({ opacity: 1, id: "tooltip" })`
  font-family: sans-serif;
`;

export function tooltip(content: string | undefined) {
  if (!content) return {};
  return {
    "data-tooltip-id": "tooltip",
    "data-tooltip-content": content,
  };
}

export default Tooltip;
