import { cpSync } from "fs";

try {
  cpSync("../../packages/locale/locales", "public/locales", {
    recursive: true,
  });
} catch (e) {
  console.warn("Failed to copy locales");
}
