import styled from "styled-components";
import { Buttons, IconButton } from "./Button";

const Table = styled.table`
  width: 100%;
  max-width: 800px;
  margin-top: 1em;
  margin-bottom: 3em;

  border-collapse: collapse;

  td,
  th {
    padding: 1em;
  }

  thead {
    background: #7774;
    text-align: left;
  }

  tbody tr:nth-child(odd) {
    background: #7772;
  }
`;

export const Actions = styled(Buttons)`
  justify-content: end;
  ${IconButton} {
    font-size: 0.7em;
  }
`;

export const ButtonsCell = styled(Actions).attrs({ as: "td" })``;

export default Table;
