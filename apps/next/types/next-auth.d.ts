import { User } from "models";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & {
      email: string;
      image: string;
    };
  }
}
