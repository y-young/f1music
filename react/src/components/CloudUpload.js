import React from "react";
import { connect } from "dva";
import {
  AutoComplete,
  Input,
  Table,
  Form,
  Button,
  Select,
  Spin,
  message
} from "antd";
import { YPlayer } from "components";

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;

const CloudUpload = ({ upload, loading, dispatch, form }) => {
  const { searchResult } = upload;
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const columns = [
    { dataIndex: "name", title: "曲名" },
    {
      dataIndex: "artist",
      title: "歌手",
      render: (text, row) => {
        return { children: text.toString() };
      }
    },
    { dataIndex: "album", title: "专辑" }
  ];

  const search = keyword => {
    if (keyword) {
      dispatch({ type: "upload/search", payload: keyword });
    } else {
      message.error("请输入搜索词");
    }
  };

  const getMp3 = (expanded, row) => {
// music.163.com/song/media/outer/url?id={id}.mp3
    if (expanded && row && !row.mp3) {
      dispatch({ type: "upload/fetchMp3", payload: row });
    }
  };

  const handleUpload = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      dispatch({ type: "upload/upload", payload: values });
    });
  };

  const renderExpanded = row => {
    return (
      <div>
        <Form layout="inline" hideRequiredMark={true}>
          {getFieldDecorator("id", { initialValue: row.id })(
            <Input type="hidden" />
          )}
          <FormItem label="时段" hasFeedback>
            {getFieldDecorator("time", {
              rules: [{ required: true, message: "请选择时段" }]
            })(
              <Select placeholder="选择时段" style={{ width: "95px" }}>
                <Option value="1">6:30</Option>
                <Option value="2">7:00</Option>
                <Option value="3">13:45</Option>
                <Option value="4">18:40</Option>
                <Option value="5">21:35</Option>
                <Option value="6">22:30</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="曲名" hasFeedback>
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请选择或填写曲名" }]
            })(
              <AutoComplete
                placeholder="请选择或输入曲名"
                style={{ width: 160 }}
              >
                <Option value={row.name}>{row.name}</Option>
              </AutoComplete>
            )}
          </FormItem>
          <FormItem label="来源" hasFeedback>
            {getFieldDecorator("origin")(
              <AutoComplete
                placeholder="请选择或输入来源"
                style={{ width: 160 }}
              >
                <Option value={row.artist.toString()}>
                  {row.artist.toString()}
                </Option>
                <Option value={row.album}>{row.album}</Option>
              </AutoComplete>
            )}
          </FormItem>
          <br />
          <FormItem label="试听">
            <Spin spinning={!row.mp3}>
              <YPlayer src={row.mp3} mini={true} style={{ marginTop: "1px" }} />
            </Spin>
          </FormItem>
          <FormItem label="上传">
            <Button
              type="primary"
              onClick={handleUpload}
              loading={loading.effects['upload/upload']}
              icon="upload"
            >
              上传
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  };

  return (
    <div>
      <Search
        placeholder="搜索音乐"
        enterButton
        onSearch={search}
        onPressEnter={e => search(e.target.value)}
        style={{ marginBottom: "10px" }}
        required
        maxLength="30"
      />
      <Table
        dataSource={searchResult}
        columns={columns}
        expandedRowRender={renderExpanded}
        expandRowByClick={true}
        onExpand={getMp3}
        loading={loading.effects["upload/search"]}
        rowKey="id"
        pagination={false}
        scroll={{ x: true }}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default connect(({ upload, loading }) => ({ upload, loading }))(
  Form.create()(CloudUpload)
);
