import { parse } from "qs";
import moment from "moment";

export function getPageQuery() {
  return parse(window.location.href.split("?")[1]);
}

export function renderDateTime(datetime) {
  return (
    <time dateTime={datetime}>
      {moment(datetime).format("YYYY-MM-DD HH:mm:ss")}
    </time>
  );
}

export const ellipsis = (text, maxLength) => {
  if (text.length > maxLength) {
    return <span title={text}>{text.slice(0, maxLength)}...</span>;
  }
  return text;
};
