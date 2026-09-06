// @ts-check
import bundleAnalyzer from "@next/bundle-analyzer";
import i18nConfig from "./next-i18next.config";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/*** @type {import('next').NextConfig} */
export default withBundleAnalyzer({
  reactStrictMode: true,
  transpilePackages: ["ui", "logic", "models"],
  compiler: {
    styledComponents: true,
  },
  // webpack: (config) => {
  //   config.resolve.extensionAlias = {
  //     ".js": [".ts", ".tsx", ".js", ".jsx"],
  //   };
  //   return config;
  // },
  i18n: i18nConfig.i18n,
});
