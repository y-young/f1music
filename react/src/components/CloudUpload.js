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
  const [playing, setPlaying] = useState(false);
  const [row, setRow] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);

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
    {
      dataIndex: "name",
      title: "曲名",
      width: 200,
      render: (text, row) => (
        <a
          href={`https://music.163.com/#/song?id=${row.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      )
    },
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
      dispatch({ type: "upload/search", payload: keyword }).then(() =>
        setPage(1)
      );
    } else {
      message.error("请输入搜索词或粘贴链接");
    }
  };

  const onCancel = () => {
    setPlaying(false);
    setVisible(false);
  }

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
        placeholder="输入关键词或粘贴歌曲、专辑、歌单链接"
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
        pagination={{ current: page, onChange: setPage }}
        scroll={{ x: 500 }}
      />
      {row && (
        <Modal
          open={visible}
          onCancel={onCancel}
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
                <YPlayer
                  src={row.mp3}
                  playing={playing}
                  onChange={setPlaying}
                  mini
                  style={{ marginTop: "1px" }}
                />
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
