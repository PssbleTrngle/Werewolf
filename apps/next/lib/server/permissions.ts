import { User } from "models";

export function isAdmin(user: User) {
  return process.env.NEXT_ADMIN_EMAIL === user.id;
}
