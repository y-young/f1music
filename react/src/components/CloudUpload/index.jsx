import { useRef, useState } from "react";
import { AutoComplete, Button, Form, Input, Modal, Table, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useMyUploads, useSearch, useUpload } from "services/upload";

import { BottomTips, Player, TimeSelector } from "components";

const Search = Input.Search;
const FormItem = Form.Item;
const Option = AutoComplete.Option;

const CloudUpload = () => {
  const [row, setRow] = useState(null);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const playerRef = useRef(null);

  const [keyword, setKeyword] = useState("");
  const { fetchMp3, ...search } = useSearch(keyword);
  const searchResult = search.data ?? [];

  const upload = useUpload();
  const myUploads = useMyUploads();

  const handleSearch = async (newKeyword) => {
    if (newKeyword) {
      const oldKeyword = keyword;
      setKeyword(newKeyword);
      // Provide a way to manually refresh the data
      if (oldKeyword === newKeyword) {
        await search.mutate();
      }
      setPage(1);
    } else {
      message.error("请输入搜索词或粘贴链接");
    }
  };

  const openModal = async (row) => {
    setRow(row);
    form.setFieldsValue({
      name: row.name,
      origin: row.artist.join(", "),
    });
    const mp3Available = row.mp3 ?? (await fetchMp3.trigger(row.id));
    if (mp3Available) {
      setVisible(true);
    } else {
      message.error("暂不支持上传付费歌曲，请使用手动上传");
    }
  };

  const onCancel = () => {
    setVisible(false);
    if (playerRef.current) {
      playerRef.current.stop();
    }
  };

  const handleUpload = (id) =>
    form
      .validateFields()
      .then((values) => upload.trigger({ id, ...values }))
      .then(() => {
        message.success("上传成功");
        setVisible(false);
        myUploads.mutate();
      })
      .catch(() => {});

  const columns = [
    {
      title: "上传",
      render: (row) => (
        <Button
          icon={<UploadOutlined />}
          loading={fetchMp3.isMutating}
          onClick={() => openModal(row)}
        />
      ),
      fixed: "left",
      width: 60,
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
      ),
    },
    {
      dataIndex: "artist",
      title: "歌手",
      width: 150,
      render: (text) => text.join(", "),
    },
    { dataIndex: "album", title: "专辑", width: 200 },
  ];

  return (
    <div>
      <Search
        enterButton
        required
        placeholder="输入关键词或粘贴歌曲、专辑、歌单链接"
        style={{ marginBottom: "10px" }}
        loading={search.isValidating}
        onSearch={handleSearch}
      />
      <Table
        dataSource={search.data}
        columns={columns}
        loading={search.isValidating}
        rowKey="id"
        pagination={{ current: page, onChange: setPage }}
        scroll={{ x: 500 }}
      />
      {row && (
        <Modal
          forceRender
          centered
          open={visible}
          confirmLoading={upload.isMutating}
          okText="上传"
          title="上传歌曲"
          onCancel={onCancel}
          onOk={() => handleUpload(row.id)}
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
              <Player
                ref={playerRef}
                mini
                src={`https://music.163.com/song/media/outer/url?id=${row.id}.mp3`}
              />
            </FormItem>
          </Form>
        </Modal>
      )}
      {searchResult.length > 0 && (
        <BottomTips>遇到了问题？试试手动上传吧</BottomTips>
      )}
    </div>
  );
};

export default CloudUpload;
