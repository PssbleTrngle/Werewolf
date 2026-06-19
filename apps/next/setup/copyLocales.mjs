import { cpSync } from "fs";

try {
  cpSync("node_modules/locale/locales", "public/locales", {
    recursive: true,
  });
} catch {
  console.warn("Failed to copy locales");
}
