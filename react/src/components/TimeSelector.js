import { Select } from "antd";
import { timeIdToText } from "utils/config";

const options = Object.entries(timeIdToText).map(([key, value]) => ({
  value: key,
  label: value,
}));

const TimeSelector = props => <Select placeholder="选择时段" options={options} {...props} />;

export default TimeSelector;
