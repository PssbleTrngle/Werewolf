import { cpSync } from "fs";

try {
  cpSync("node_modules/locale/locales", "public/locales", {
    recursive: true,
  });
} catch (e) {
  console.warn("Failed to copy locales");
}

try {
  cpSync("../../assets/icon.svg", "public/icons/icon.svg");
} catch (e) {
  console.warn("Failed to copy icon");
}
