import React, { useState, useRef } from "react";
import {
  Form,
  Table,
  Button,
  Input,
  Tag,
  Modal,
  Space,
  Badge,
  message
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  RollbackOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { TagsSelect } from "components/admin";
import { Audio, TimeSelector } from "components";
import { timeFilters } from "config";
import { renderDateTime, ellipsis, dateSorter } from "utils/utils";
import InlineForm, { InlineFormRow } from "components/admin/InlineForm";
import Title from "hooks/useTitle";
import { useSongs } from "services/admin/songs";

const FormItem = Form.Item;
const colors = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple"
];

const Songs = ({ isTrashed = false }) => {
  const { save, trash, restore, del, ...songs } = useSongs(isTrashed);
  const list = songs.data ?? [];

  const [form] = Form.useForm();
  const searchInputRef = useRef();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const tagColors = new Map();

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInputRef}
          placeholder="输入关键词"
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInputRef.current.select());
      }
    }
  });

  const handleRefresh = () => {
    songs.mutate();
  };

  const editSong = (row) => {
    form.setFieldsValue({
      id: row.id,
      playtime: row.playtime,
      name: row.name,
      origin: row.origin,
      tags: row.tags
    });
    setModalVisible(true);
  };

  const handleSave = () =>
    form
      .validateFields()
      .then((values) =>
        save.trigger(values).then(() => {
          message.success("操作成功");
          setModalVisible(false);
        })
      )
      .catch(() => {});

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleDelete = (id, isDelete = false) => {
    const request = isDelete ? del.trigger(id) : trash.trigger(id);
    return request.then(() => {
      message.success("操作成功");
    });
  };

  const handleBatchDelete = (isDelete = false) =>
    handleDelete(selectedRowKeys, isDelete).then(() => setSelectedRowKeys([]));

  const handleRestore = (id) =>
    restore
      .trigger(id)
      .then(() => {
        message.success("操作成功");
      })
      .catch(() => {});

  const handleBatchRestore = () =>
    handleRestore(selectedRowKeys).then(() => setSelectedRowKeys([]));

  const getTagColor = (tagName) => {
    let color;
    if (!tagColors.has(tagName)) {
      color = colors[Math.floor(Math.random() * 11)];
      tagColors.set(tagName, color);
    } else {
      color = tagColors.get(tagName);
    }
    return color;
  };

  const renderExpanded = (row) => {
    const { file } = row;

    return (
      <InlineForm>
        <InlineFormRow>
          <FormItem label="时段">{row.playtime}</FormItem>
          <FormItem label="曲名">{row.name}</FormItem>
          <FormItem label="来源">{row.origin}</FormItem>
        </InlineFormRow>
        <InlineFormRow>
          <FormItem label="创建时间">{renderDateTime(row.created_at)}</FormItem>
          <FormItem label="最后更新时间">
            {renderDateTime(row.updated_at)}
          </FormItem>
          {isTrashed && (
            <FormItem label="删除时间">
              {renderDateTime(row.deleted_at)}
            </FormItem>
          )}
          {file.cloud_id && (
            <FormItem label="云上传ID">
              <a
                href={`https://music.163.com/#/song?id=${file.cloud_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.cloud_id}
              </a>
            </FormItem>
          )}
        </InlineFormRow>
        <InlineFormRow>
          <FormItem label="试听">
            <Audio
              controls
              preload="none"
              cloudId={file.cloud_id}
              src={file.url}
            />
          </FormItem>
          <FormItem label="操作">
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => editSong(row)}
              >
                编辑
              </Button>
              {isTrashed ? (
                <Space>
                  <Button
                    icon={<RollbackOutlined />}
                    onClick={() => handleRestore([row.id])}
                    loading={restore.isMutating}
                  >
                    恢复
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete([row.id], true)}
                    loading={del.isMutating}
                  >
                    彻底删除
                  </Button>
                </Space>
              ) : (
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete([row.id])}
                  loading={trash.isMutating}
                >
                  删除
                </Button>
              )}
              <Button
                icon={<DownloadOutlined />}
                href={"/api/download/" + row.id}
              >
                下载
              </Button>
            </Space>
          </FormItem>
        </InlineFormRow>
      </InlineForm>
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys
  };
  const columns = [
    {
      dataIndex: "id",
      title: "#",
      width: "60px",
      sorter: (a, b) => a.id - b.id
    },
    {
      dataIndex: "playtime",
      title: "时段",
      width: "80px",
      filters: timeFilters,
      onFilter: (value, record) => record.playtime === value
    },
    {
      dataIndex: "name",
      title: "曲名",
      ...getColumnSearchProps("name"),
      render: (text, record) => (
        <Badge
          dot={record.reports_count > 0}
          title={`${record.reports_count} 条反馈`}
        >
          <span style={{ lineHeight: 1.5715 }}>{text}</span>
        </Badge>
      )
    },
    {
      dataIndex: "origin",
      title: "来源",
      width: "100px",
      ...getColumnSearchProps("origin"),
      render: (text) => ellipsis(text, 50)
    },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      render: (tags) => (
        <span>
          {tags.map((tag) => {
            if (tag !== "") {
              let color = getTagColor(tag);
              return (
                <Tag color={color} key={tag}>
                  {tag}
                </Tag>
              );
            } else {
              return null;
            }
          })}
        </span>
      ),
      ...getColumnSearchProps("tags")
    },
    {
      dataIndex: isTrashed ? "deleted_at" : "created_at",
      title: isTrashed ? "删除时间" : "时间",
      render: renderDateTime,
      sorter: isTrashed && ((a, b) => dateSorter(a.deleted_at, b.deleted_at))
    }
  ];

  return (
    <>
      <Title>{isTrashed ? "曲目 - 回收站" : "曲目"}</Title>
      <div style={{ fontSize: "14px", color: "#777", display: "inline-block" }}>
        曲目总数: {list.length} 首 已选中: {selectedRowKeys.length} 首
      </div>
      <Button
        icon={<ReloadOutlined />}
        onClick={handleRefresh}
        style={{ float: "right" }}
      />
      <br />
      <Table
        dataSource={list}
        columns={columns}
        rowSelection={rowSelection}
        expandedRowRender={renderExpanded}
        expandable={{ expandRowByClick: true }}
        loading={songs.isValidating}
        rowKey="id"
        scroll={{ x: 600 }}
      />
      {isTrashed ? (
        <Space>
          <Button
            onClick={handleBatchRestore}
            loading={restore.isMutating}
            disabled={selectedRowKeys.length === 0}
          >
            恢复所选
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleBatchDelete(true)}
            loading={del.isMutating}
            disabled={selectedRowKeys.length === 0}
          >
            彻底删除所选
          </Button>
        </Space>
      ) : (
        <Button
          type="primary"
          danger
          onClick={() => handleBatchDelete(false)}
          loading={trash.isMutating}
          disabled={selectedRowKeys.length === 0}
        >
          删除所选
        </Button>
      )}
      <Modal
        open={modalVisible}
        onCancel={handleCancel}
        confirmLoading={save.isMutating}
        okText="保存"
        title="编辑曲目"
        onOk={handleSave}
        forceRender
        centered
      >
        <Form form={form} labelCol={{ span: 3 }}>
          <FormItem name="id" hidden={true} noStyle={true}>
            <Input type="hidden" />
          </FormItem>
          <FormItem label="时段" name="playtime">
            <TimeSelector style={{ width: "120px" }} />
          </FormItem>
          <FormItem
            label="曲名"
            name="name"
            rules={[{ required: true, message: "请填写曲名" }]}
          >
            <Input
              placeholder="曲名"
              maxLength={100}
              onPressEnter={handleSave}
            />
          </FormItem>
          <FormItem label="来源" name="origin">
            <Input
              placeholder="来源"
              maxLength={200}
              onPressEnter={handleSave}
            />
          </FormItem>
          <FormItem
            label="标签"
            name="tags"
            rules={[
              { type: "array" },
              {
                validator: (rule, value) => {
                  if (!value || value.toString().length <= 200) {
                    return Promise.resolve();
                  }
                  return Promise.reject("标签总长度不得超过200");
                }
              }
            ]}
          >
            <TagsSelect placeholder="曲目标签" />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default Songs;
