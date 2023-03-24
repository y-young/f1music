import dva from "dva";
import createLoading from "dva-loading";
// import { createSentry, Raven } from "utils";
import { message } from "antd";
import "./app.less";

// 1. Initialize
const app = dva({
  onError(e, dispatch) {
    if (e.type && e.type === "notice") {
      e.preventDefault();
      message.error(e.message);
    } else {
      // 程序错误不提示
      message.error("出错了,请刷新重试");
      // Raven.captureException(e, {
      //   logger: "javascript.effect"
      // });
      console.log(e);
    }
  }
});

// 2. Plugins
app.use(createLoading());
// app.use(createSentry({
//   context: {
//     tags: {
//       page: "app"
//     }
//   }
// }));

// 3. Model
const models = ["app", "upload", "vote"];
models.forEach(m => app.model(require("../models/app/" + m).default));

// 4. Router
app.router(require("./router").default);

// 5. Start
app.start("#root");

export default app._store;
