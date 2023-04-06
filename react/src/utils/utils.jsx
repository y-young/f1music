import dayjs from "dayjs";
import produce from "immer";

export const renderDateTime = (datetime) => {
  const value = dayjs(datetime);
  if (!value.isValid()) {
    return null;
  }
  return (
    <time dateTime={datetime}>
      {dayjs(datetime).format("YYYY-MM-DD HH:mm:ss")}
    </time>
  );
};

export const ellipsis = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return <span title={text}>{text.slice(0, maxLength)}...</span>;
  }
  return text;
};

export const dateSorter = (a, b) => {
  const diff = dayjs(a).diff(dayjs(b));
  if (diff > 0) {
    return 1;
  }
  if (diff < 0) {
    return -1;
  }
  return 0;
};

export const removeById = (data, ids) =>
  produce(data, (draft) => draft.filter((item) => !ids.includes(item.id)));

export const initSentry = () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    import("@sentry/react").then((Sentry) => {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        release: import.meta.env.VITE_RELEASE,
        integrations: [new Sentry.Replay()],
        replaysOnErrorSampleRate: 1.0
      });
    });
  }
};
