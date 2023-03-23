import dva from "dva";
import createLoading from "dva-loading";
// import { createSentry, Raven } from "utils/admin";
import { message } from "antd";
import "./admin.css";

// 1. Initialize
const app = dva({
  onError(e, dispatch) {
    message.error(e.message);
    if (!e.type || e.type !== "notice") {
      // Raven.captureException(e, {
      //   logger: "javascript.effect"
      // });
      console.log(e);
    }
  }
});

// 2. Plugins
app.use(createLoading());
// app.use(
//   createSentry({
//     context: {
//       tags: {
//         page: "admin"
//       }
//     }
//   })
// );

// 3. Model
const models = ["songs", "files", "reports", "rank", "statistics"];
models.forEach(m => app.model(require("../models/admin/" + m).default));

// 4. Router
app.router(require("./adminRouter").default);

// 5. Start
app.start("#root");

export default app._store;
