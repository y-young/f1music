import dva from "dva";
import createLoading from "dva-loading";
import { message } from "antd";
import "./index.css";

// 1. Initialize
const app = dva({
  onError(e, dispatch) {
    console.log(e);
    message.error(e.message, 3);
  }
});

// 2. Plugins
app.use(createLoading());

// 3. Model
const models = ["login", "vote", "app", "upload"];
models.forEach(m => app.model(require("./models/" + m).default));

// 4. Router
app.router(require("./router").default);

// 5. Start
app.start("#root");

export default app._store;
