import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["activeTab"],
    action: {
      default_title: "FirstCommit - View first commit"
    }
  },
});
