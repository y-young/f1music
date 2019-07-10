import React from "react";
import { connect } from "dva";
import {
  Icon,
  AutoComplete,
  Input,
  Table,
  Form,
  Button,
  Spin,
  message
} from "antd";
import { YPlayer, TimeSelector } from "components";

const Search = Input.Search;
const FormItem = Form.Item;
const Option = AutoComplete.Option;

const CloudUpload = ({ upload, loading, dispatch, form }) => {
  const { searchResult } = upload;
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = form;

  const columns = [
    { dataIndex: "name", title: "曲名", width: 200 },
    {
      dataIndex: "artist",
      title: "歌手",
      width: 150,
      render: (text, row) => {
        return { children: text.toString() };
      }
    },
    { dataIndex: "album", title: "专辑", width: 200 }
  ];

  const search = keyword => {
    if (keyword) {
      dispatch({ type: "upload/search", payload: keyword });
    } else {
      message.error("请输入搜索词");
    }
  };

  const onExpand = (expanded, row) => {
    // music.163.com/song/media/outer/url?id={id}.mp3
    if (expanded && row && !row.mp3) {
      dispatch({ type: "upload/fetchMp3", payload: row });
    }
    if (expanded && row) {
      resetFields();
    }
  };

  const handleUpload = id => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      values = { id: id, ...values };
      dispatch({ type: "upload/upload", payload: values });
    });
  };

  const renderExpanded = row => {
    return (
      <div>
        <Form layout="inline" hideRequiredMark={true}>
          <FormItem label="时段">
            {getFieldDecorator("time", {
              rules: [{ required: true, message: "请选择时段" }]
            })(<TimeSelector style={{ width: "110px" }} />)}
          </FormItem>
          <FormItem label="曲名">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请选择或填写曲名" }]
            })(
              <AutoComplete
                placeholder="请选择或输入曲名"
                style={{ width: 250 }}
              >
                <Option value={row.name}>{row.name}</Option>
              </AutoComplete>
            )}
          </FormItem>
          <br />
          <FormItem label="来源">
            {getFieldDecorator("origin")(
              <AutoComplete
                placeholder="请选择或输入来源"
                style={{ width: 300 }}
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
              <YPlayer src={row.mp3} mini style={{ marginTop: "1px" }} />
            </Spin>
          </FormItem>
          <FormItem label="上传">
            <Button
              type="primary"
              onClick={() => handleUpload(row.id)}
              loading={loading.effects["upload/upload"]}
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
      />
      <Table
        dataSource={searchResult}
        columns={columns}
        expandedRowRender={renderExpanded}
        expandRowByClick={true}
        onExpand={onExpand}
        loading={loading.effects["upload/search"]}
        rowKey="id"
        pagination={false}
        scroll={{ x: 500 }}
      />
      {searchResult.length !== 0 && (
        <div className="tips">
          <Icon type="bulb" /> 遇到了问题？试试手动上传吧
        </div>
      )}
    </div>
  );
};

export default connect(({ upload, loading }) => ({ upload, loading }))(
  Form.create()(CloudUpload)
);
