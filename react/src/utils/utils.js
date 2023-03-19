import { parse } from 'qs'
import moment from "moment"

export function getPageQuery() {
  return parse(window.location.href.split('?')[1])
}

export function renderDateTime(datetime) {
  return (
    <time dateTime={datetime}>
      {moment(datetime).format('YYYY-MM-DD HH:mm:ss')}
    </time>
  );
}
