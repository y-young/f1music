import React, { useState, useRef } from "react";
import { connect } from "dva";
import { Form, Table, Button, Input, Tag, Select, Modal, Space } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  RollbackOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { TimeSelector } from "components/admin";
import { timeFilters } from "config";
import { renderDateTime } from "utils/utils";
import InlineForm, { InlineFormRow } from "components/admin/InlineForm";
import Title from "../../hooks/useTitle";

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

const Songs = ({ songs, loading, dispatch }) => {
  const [form] = Form.useForm();
  const searchInputRef = useRef();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const tagColors = new Map();

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    confirm();
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInputRef}
          placeholder="输入关键词"
          value={selectedKeys[0]}
          onChange={e =>
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
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInputRef.current.select());
      }
    }
  });

  const handleRefresh = () => {
    dispatch({ type: "songs/fetch" });
  };

  const editSong = row => {
    form.setFieldsValue({
      id: row.id,
      playtime: row.playtime,
      name: row.name,
      origin: row.origin,
      tags: row.tags
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(values => {
        dispatch({ type: "songs/save", payload: values }).then(success => {
          if (success) {
            setModalVisible(false);
          }
        });
      })
      .catch(error => {});
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleDelete = (id, isDelete = false) => {
    if (isDelete) {
      dispatch({ type: "songs/delete", payload: id });
    } else {
      dispatch({ type: "songs/trash", payload: id });
    }
    setSelectedRowKeys([]);
  };

  const handleBatchDelete = (isDelete = false) => {
    handleDelete(selectedRowKeys, isDelete);
  };

  const handleRestore = id => {
    dispatch({ type: "songs/restore", payload: id });
    setSelectedRowKeys([]);
  };

  const handleBatchRestore = () => {
    handleRestore(selectedRowKeys);
  };

  const getTagColor = tagName => {
    let color;
    if (!tagColors.has(tagName)) {
      color = colors[Math.floor(Math.random() * 11)];
      tagColors.set(tagName, color);
    } else {
      color = tagColors.get(tagName);
    }
    return color;
  };

  const renderExpanded = row => {
    const { type } = songs;
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
          {type === "trashed" && (
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
            <audio src={row.file.url} controls="controls" preload="none" />
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
              {type === "trashed" ? (
                <Space>
                  <Button
                    type="secondary"
                    icon={<RollbackOutlined />}
                    onClick={() => handleRestore([row.id])}
                    loading={loading.effects["songs/restore"]}
                  >
                    恢复
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete([row.id], true)}
                    loading={loading.effects["songs/delete"]}
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
                  loading={loading.effects["songs/trash"]}
                >
                  删除
                </Button>
              )}
              <Button
                type="secondary"
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

  const { type, list } = songs;
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
      ...getColumnSearchProps("name")
    },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      render: tags => (
        <span>
          {tags.map(tag => {
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
      dataIndex: "created_at",
      title: "时间",
      render: renderDateTime
    },
    {
      dataIndex: "reports_count",
      title: "反馈数",
      width: "100px",
      sorter: (a, b) => a.reports_count - b.reports_count
    }
  ];

  return (
    <>
      <Title>{type === "trashed" ? "曲目 - 回收站" : "曲目"}</Title>
      <div style={{ fontSize: "14px", color: "#777", display: "inline-block" }}>
        曲目总数: {list.length} 首 已选中: {selectedRowKeys.length} 首
      </div>
      <Button
        type="secondary"
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
        loading={loading.effects["songs/fetch"]}
        rowKey="id"
        scroll={{ x: 600 }}
      />
      {type === "trashed" ? (
        <Space>
          <Button
            type="secondary"
            onClick={handleBatchRestore}
            loading={loading.effects["songs/restore"]}
          >
            恢复所选
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleBatchDelete(true)}
            loading={loading.effects["songs/delete"]}
          >
            彻底删除所选
          </Button>
        </Space>
      ) : (
        <Button
          type="primary"
          danger
          onClick={() => handleBatchDelete(false)}
          loading={loading.effects["songs/trash"]}
        >
          删除所选
        </Button>
      )}
      <Modal
        open={modalVisible}
        onCancel={handleCancel}
        confirmLoading={loading.effects["songs/save"]}
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
            <Select
              mode="tags"
              placeholder="曲目标签"
              open={false}
              tokenSeparators={[",", "，"]}
            ></Select>
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default connect(({ songs, loading }) => ({ songs, loading }))(Songs);
