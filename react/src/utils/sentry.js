import * as Raven from "raven-js";

const dsn = "***REMOVED***";

function createSentry(props) {
  const { config, context } = props;

  Raven.config(dsn, {
    shouldSendCallback: data => {
      if (data.extra.__serialized__) {
        const { type } = data.extra.__serialized__;
        return !type || type !== "notice";
      } else {
        return true;
      }
    },
    ...config
  }).install();

  if (context) {
    const { tags } = context;
    if (tags) {
      Raven.setTagsContext(tags);
    }
  }

  return {
    onAction: store => next => action => {
      try {
        const { type, ...others } = action;
        Raven.captureBreadcrumb({
          category: "action.start",
          data: others,
          message: type
        });
        next(action);
        Raven.captureBreadcrumb({
          category: "action.end",
          data: others,
          message: type
        });
      } catch (e) {
        if (!e.type || e.type !== "notice") {
          Raven.captureException(e, {
            extra: {
              action,
              state: store.getState()
            },
            logger: "javascript.action"
          });
        }
      }
    },
    onEffect: (effect, _, model, action) =>
      function*(...args) {
        Raven.captureBreadcrumb({
          category: "effect.start",
          message: action
        });
        yield effect(...args);
        Raven.captureBreadcrumb({
          category: "effect.stop",
          message: action
        });
      }
  };
}

export { createSentry, Raven };
