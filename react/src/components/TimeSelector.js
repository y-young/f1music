import React from "react";
import { Select } from "antd";

const Option = Select.Option;

const TimeSelector = props => {
  return (
    <Select placeholder="选择时段" {...props}>
      <Option value="1">6:30</Option>
      <Option value="2">7:00</Option>
      <Option value="3">13:45</Option>
      <Option value="4">18:40</Option>
      <Option value="5">21:35</Option>
      <Option value="6">22:30</Option>
    </Select>
  );
};

export default TimeSelector;
