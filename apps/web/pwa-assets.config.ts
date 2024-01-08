import {
  defineConfig,
  minimal2023Preset as preset,
} from "@vite-pwa/assets-generator/config";
import { loadEnv } from "vite";

const env = loadEnv("", process.cwd(), "VITE_");
const background = env.VITE_APP_COLOR;

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    ...preset,
    maskable: {
      ...preset.maskable,
      resizeOptions: {
        background,
      },
    },
    apple: {
      ...preset.apple,
      resizeOptions: {
        background,
      },
    },
  },
  images: ["public/icons/icon.svg"],
});
