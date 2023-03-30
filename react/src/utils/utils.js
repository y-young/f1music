import { parse } from "qs";
import moment from "moment";

export function getPageQuery() {
  return parse(window.location.href.split("?")[1]);
}

export function renderDateTime(datetime) {
  const value = moment(datetime);
  if (!value.isValid()) {
    return null;
  }
  return <time dateTime={datetime}>{value.format("YYYY-MM-DD HH:mm:ss")}</time>;
}

export const ellipsis = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return <span title={text}>{text.slice(0, maxLength)}...</span>;
  }
  return text;
};

export const dateSorter = (a, b) => {
  const diff = moment(a).diff(moment(b));
  if (diff > 0) {
    return 1;
  }
  if (diff < 0) {
    return -1;
  }
  return 0;
};
