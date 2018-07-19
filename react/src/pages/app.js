import dva from "dva";
import createLoading from "dva-loading";
import { message } from "antd";
import "./app.css";

// 1. Initialize
const app = dva({
  onError(e, dispatch) {
    if (e.type && e.type === "notice") {
      message.error(e.message);
    } else { // 程序错误不提示
      message.error("出错了,请刷新重试");
      console.log(e);
    }
  }
});

// 2. Plugins
app.use(createLoading());

// 3. Model
const models = ["login", "vote", "app", "upload"];
models.forEach(m => app.model(require("../models/app/" + m).default));

// 4. Router
app.router(require("./router").default);

// 5. Start
app.start("#root");

export default app._store;
