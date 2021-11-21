import React from "react";
import { Select } from "antd";

const Option = Select.Option;

class TimeSelector extends React.Component {
  render() {
    return (
      <Select placeholder="选择时段" {...this.props}>
        <Option value="1">6:40</Option>
        <Option value="2">7:10</Option>
        <Option value="3">13:45</Option>
        <Option value="4">18:10</Option>
        <Option value="5">21:35</Option>
        <Option value="6">22:30</Option>
      </Select>
    );
  }
}

export default TimeSelector;
