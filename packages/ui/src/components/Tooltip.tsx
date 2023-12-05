import { Tooltip as ReactTooltip } from "react-tooltip";
import styled from "styled-components";

const Tooltip = styled(ReactTooltip).attrs({ opacity: 1 })`
  font-family: sans-serif;
`;

export default Tooltip;
