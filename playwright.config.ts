import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  use: {
    baseURL: "https://api.restful-api.dev",
    extraHTTPHeaders: {
      Accept: "application/json",
    },
  },

  reporter: [["list"], ["html", { open: "never" }]],
});
