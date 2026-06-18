import type { FakeData } from "models";
import type { DetailProps } from "../EventDetails";
import EventDetails from "../EventDetails";
import RolePanel from "../../RolePanel";
export default function FakeDetails({
  data,
  createTitle,
}: DetailProps<FakeData>) {
  return (
    <>
      <Notice>{createTitle()}</Notice>
      {data.role && (
        <h3>
          <RolePanel role={data.role} />
        </h3>
      )}
      <EventDetails event={data} />
    </>
  );
}

import styled from "styled-components";

const Notice = styled.i`
  display: inline-block;
  font-size: 0.8em;
  margin-bottom: 1em;
`;
