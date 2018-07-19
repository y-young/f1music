import { resolve } from "path";
export default {
  entry: {
    "app": resolve(__dirname, "./src/pages/app.js"),
    "admin": resolve(__dirname, "./src/pages/admin.js")
  },
  outputPath: resolve(__dirname, "../public/assets/"),
  /*commons: [
    {
      name: "common",
      chunks: ["app", "admin"]
    }
  ],*/
  extraBabelPlugins: [
    ["import", { libraryName: "antd", libraryDirectory: "es", style: "css" }]
  ],  
  alias: {
    components: resolve(__dirname, "./src/components"),
    utils: resolve(__dirname, "./src/utils"),
    config: resolve(__dirname, "./src/utils/config"),
    services: resolve(__dirname, "./src/services"),
    models: resolve(__dirname, "./src/models"),
    routes: resolve(__dirname, "./src/routes")
  },
  proxy: {
    "/api": {
      target: "http://localhost:81/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" }
    }
  },
  ignoreMomentLocale: true
};
