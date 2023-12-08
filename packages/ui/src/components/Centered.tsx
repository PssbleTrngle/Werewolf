import styled, { ShouldForwardProp, css } from "styled-components";

export const CenteredHorizontal = css`
  height: fit-content;
`;

const shouldForwardProp: ShouldForwardProp<"web"> = (key) => {
  return key !== "horizontalOnly";
};

const Centered = styled.section.withConfig({ shouldForwardProp })<{
  horizontalOnly?: boolean;
}>`
  display: grid;
  place-items: center;
  ${(p) => p.horizontalOnly && CenteredHorizontal}
`;

export default Centered;
