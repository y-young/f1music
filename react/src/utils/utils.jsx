import moment from "moment";
import produce from "immer";

export const renderDateTime = (datetime) => {
  return (
    <time dateTime={datetime}>
      {moment(datetime).format("YYYY-MM-DD HH:mm:ss")}
    </time>
  );
};

export const removeById = (data, ids) =>
  produce(data, (draft) => draft.filter((item) => !ids.includes(item.id)));
