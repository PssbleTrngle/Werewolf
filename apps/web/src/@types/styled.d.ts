import "styled-components";

// TODO I don't want to have this duplicated here
declare module "styled-components" {
  export interface DefaultTheme {
    bg: string;
    text: string;
    accent: string;
    nav: string;
    error: string;
  }
}
