import moment from "moment";
import produce from "immer";

export const renderDateTime = (datetime) => {
  const value = moment(datetime);
  if (!value.isValid()) {
    return null;
  }
  return (
    <time dateTime={datetime}>
      {moment(datetime).format("YYYY-MM-DD HH:mm:ss")}
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
  const diff = moment(a).diff(moment(b));
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
