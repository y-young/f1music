import React, { useState } from "react";
import { connect } from "dva";
import {
  Form,
  Modal,
  AutoComplete,
  Input,
  Table,
  Button,
  Spin,
  message
} from "antd";
import { UploadOutlined, BulbOutlined } from "@ant-design/icons";
import { YPlayer, TimeSelector } from "components";

const Search = Input.Search;
const FormItem = Form.Item;
const Option = AutoComplete.Option;

const CloudUpload = ({ upload, loading, dispatch }) => {
  const { searchResult } = upload;
  const [visible, setVisible] = useState(false);
  const [row, setRow] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "上传",
      render: row => (
        <Button
          icon={<UploadOutlined />}
          loading={loading.effects["upload/fetchMp3"]}
          onClick={() => {
            openModal(row);
          }}
        />
      ),
      fixed: "left",
      width: 60
    },
    { dataIndex: "name", title: "曲名", width: 200 },
    {
      dataIndex: "artist",
      title: "歌手",
      width: 150,
      render: text => text.join(", ")
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

  const openModal = row => {
    // music.163.com/song/media/outer/url?id={id}.mp3
    setRow(row);
    form.setFieldsValue({ name: row.name, origin: row.artist.join(", ") });
    if (!row.mp3) {
      dispatch({ type: "upload/fetchMp3", payload: row }).then(success => {
        if (success) {
          setVisible(true);
        }
      });
    } else {
      setVisible(true);
    }
  };

  const handleUpload = id => {
    form
      .validateFields()
      .then(values => {
        values = { id: id, ...values };
        dispatch({ type: "upload/upload", payload: values }).then(success => {
          if (success) {
            setVisible(false);
          }
        });
      })
      .catch(error => {});
  };

  return (
    <div>
      <Search
        placeholder="输入关键词"
        enterButton
        onSearch={search}
        onPressEnter={e => search(e.target.value)}
        style={{ marginBottom: "10px" }}
        required
        loading={loading.effects["upload/search"]}
      />
      <Table
        dataSource={searchResult}
        columns={columns}
        loading={loading.effects["upload/search"]}
        rowKey="id"
        pagination={false}
        scroll={{ x: 500 }}
      />
      {row && (
        <Modal
          open={visible}
          onCancel={() => setVisible(false)}
          confirmLoading={loading.effects["upload/upload"]}
          okText="上传"
          title="上传歌曲"
          onOk={() => handleUpload(row.id)}
          forceRender
          centered
        >
          <Form form={form} labelCol={{ span: 3 }}>
            <FormItem
              label="时段"
              name="time"
              rules={[{ required: true, message: "请选择时段" }]}
            >
              <TimeSelector style={{ width: "110px" }} />
            </FormItem>
            <FormItem
              label="曲名"
              name="name"
              rules={[{ required: true, message: "请选择或填写曲名" }]}
            >
              <AutoComplete placeholder="请选择或输入曲名">
                <Option value={row.name}>{row.name}</Option>
              </AutoComplete>
            </FormItem>
            <FormItem label="来源" name="origin">
              <AutoComplete placeholder="请选择或输入来源">
                <Option value={row.artist.join(", ")}>
                  {row.artist.join(", ")}
                </Option>
                <Option value={row.album}>{row.album}</Option>
              </AutoComplete>
            </FormItem>
            <FormItem label="试听">
              <Spin spinning={!row.mp3}>
                <YPlayer src={row.mp3} mini style={{ marginTop: "1px" }} />
              </Spin>
            </FormItem>
          </Form>
        </Modal>
      )}
      {searchResult.length !== 0 && (
        <div className="tips">
          <BulbOutlined /> 遇到了问题？试试手动上传吧
        </div>
      )}
    </div>
  );
};

export default connect(({ upload, loading }) => ({ upload, loading }))(
  CloudUpload
);
