import React from 'react';
import { Form, Input, Icon, Select, Upload } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

Class ManualUpload extends React.Component
{
  render() {
    return (
      <Form>
        <FormItem label="时段">
          <Select placeholder="选择时段">
            <Option value="1">6:30</Option>
            <Option value="2">7:00</Option>
            <Option value="3">13:45</Option>
            <Option value="4">18:40</Option>
            <Option value="5">21:35</Option>
            <Option value="6">22:30</Option>
          </Select>
        </FormItem>
        <FormItem label="曲名">
          <Input placeholder="歌曲名称" maxlength="30"/>
        </FormItem>
        <FormItem label="来源">
          <Input placeholder="该曲目来自的专辑、音乐家或节目、游戏等，不是表示上传者，不明来源可以留空" :maxlength="50"/>
        </FormItem>
        <FormItem label="上传文件">
          <Upload.Dragger action="/Upload">
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p class="ant-upload-text">将文件拖到此处，或<em>点击上传</em></p>
            <p class="ant-upload-hint">只能上传mp3文件，且大小不超过20MB</p>
          </Upload.Dragger>
        </FormItem>
      </Form>
    );
  }
};
