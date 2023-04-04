import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ReloadOutlined,
  RollbackOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Badge, Button, Form, Input, Modal, Space, Table, Tag } from "antd";
import { Audio } from "components";
import { TagsSelect, TimeSelector } from "components/admin";
import InlineForm, { InlineFormRow } from "components/admin/InlineForm";
import { timeFilters } from "config";
import { connect } from "dva";
import React from "react";
import { dateSorter, ellipsis, renderDateTime } from "utils/utils";

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
  "purple",
];

class Songs extends React.Component {
  state = {
    selectedRowKeys: [],
    searchText: "",
    searchColumn: "",
    modalVisible: false,
  };

  tagColors = new Map();
  form = React.createRef();

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder="输入关键词"
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters, confirm) => {
    clearFilters();
    this.setState({ searchText: "" });
    confirm();
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleRefresh = () => {
    const { dispatch } = this.props;
    dispatch({ type: "songs/fetch" });
  };

  editSong = row => {
    this.form.current.setFieldsValue({
      id: row.id,
      playtime: row.playtime,
      name: row.name,
      origin: row.origin,
      tags: row.tags,
    });
    this.setState({ modalVisible: true });
  };

  handleSave = () => {
    const { dispatch } = this.props;
    this.form.current
      .validateFields()
      .then(values => {
        dispatch({ type: "songs/save", payload: values }).then(success => {
          if (success) {
            this.setState({ modalVisible: false });
          }
        });
      });
    // .catch(error => {});
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  handleDelete = (id, isDelete = false) => {
    const { dispatch } = this.props;
    if (isDelete) {
      dispatch({ type: "songs/delete", payload: id });
    } else {
      dispatch({ type: "songs/trash", payload: id });
    }
    this.setState({ selectedRowKeys: [] });
  };

  handleBatchDelete = (isDelete = false) => {
    this.handleDelete(this.state.selectedRowKeys, isDelete);
  };

  handleRestore = id => {
    const { dispatch } = this.props;
    dispatch({ type: "songs/restore", payload: id });
    this.setState({ selectedRowKeys: [] });
  };

  handleBatchRestore = () => {
    this.handleRestore(this.state.selectedRowKeys);
  };

  getTagColor = tagName => {
    const tagColors = this.tagColors;
    let color;
    if (!tagColors.has(tagName)) {
      color = colors[Math.floor(Math.random() * 11)];
      tagColors.set(tagName, color);
      this.tagColors = tagColors;
    } else {
      color = tagColors.get(tagName);
    }
    return color;
  };

  renderExpanded = row => {
    const { songs, loading } = this.props;
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
            <Audio
              controls
              preload="none"
              cloudId={file.cloud_id}
              src={row.file.url}
            />
          </FormItem>
          <FormItem label="操作">
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => this.editSong(row)}
              >
                编辑
              </Button>
              {type === "trashed"
                ? (
                  <Space>
                    <Button
                      type="secondary"
                      icon={<RollbackOutlined />}
                      onClick={() => this.handleRestore([row.id])}
                      loading={loading.effects["songs/restore"]}
                    >
                      恢复
                    </Button>
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => this.handleDelete([row.id], true)}
                      loading={loading.effects["songs/delete"]}
                    >
                      彻底删除
                    </Button>
                  </Space>
                )
                : (
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => this.handleDelete([row.id])}
                    loading={loading.effects["songs/trash"]}
                  >
                    删除
                  </Button>
                )}
              <Button
                type="secondary"
                icon={<DownloadOutlined />}
                href={`/api/download/${row.id}`}
              >
                下载
              </Button>
            </Space>
          </FormItem>
        </InlineFormRow>
      </InlineForm>
    );
  };

  render() {
    const { songs, loading } = this.props;
    const { type, list } = songs;
    const { selectedRowKeys, modalVisible } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        dataIndex: "id",
        title: "#",
        width: "60px",
        sorter: (a, b) => a.id - b.id,
      },
      {
        dataIndex: "playtime",
        title: "时段",
        width: "80px",
        filters: timeFilters,
        onFilter: (value, record) => record.playtime === value,
      },
      {
        dataIndex: "name",
        title: "曲名",
        ...this.getColumnSearchProps("name"),
        render: (text, record) => (
          <Badge
            dot={record.reports_count > 0}
            title={`${record.reports_count} 条反馈`}
          >
            <span style={{ lineHeight: 1.5715 }}>{text}</span>
          </Badge>
        ),
      },
      {
        dataIndex: "origin",
        title: "来源",
        width: "100px",
        ...this.getColumnSearchProps("origin"),
        render: text => ellipsis(text, 50),
      },
      {
        title: "标签",
        key: "tags",
        dataIndex: "tags",
        render: tags => (
          <span>
            {tags.map(tag => {
              if (tag !== "") {
                const color = this.getTagColor(tag);
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
        ...this.getColumnSearchProps("tags"),
      },
      {
        dataIndex: type === "trashed" ? "deleted_at" : "created_at",
        title: type === "trashed" ? "删除时间" : "时间",
        render: renderDateTime,
        sorter: type === "trashed"
          && ((a, b) => dateSorter(a.deleted_at, b.deleted_at)),
      },
    ];

    return (
      <div>
        <div
          style={{ fontSize: "14px", color: "#777", display: "inline-block" }}
        >
          曲目总数: {list.length} 首 已选中: {selectedRowKeys.length} 首
        </div>
        <Button
          type="secondary"
          icon={<ReloadOutlined />}
          onClick={this.handleRefresh}
          style={{ float: "right" }}
        />
        <br />
        <Table
          dataSource={list}
          columns={columns}
          rowSelection={rowSelection}
          expandedRowRender={this.renderExpanded}
          loading={loading.effects["songs/fetch"]}
          rowKey="id"
          scroll={{ x: 600 }}
        />
        {type === "trashed"
          ? (
            <Space>
              <Button
                type="secondary"
                onClick={this.handleBatchRestore}
                loading={loading.effects["songs/restore"]}
              >
                恢复所选
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => this.handleBatchDelete(true)}
                loading={loading.effects["songs/delete"]}
              >
                彻底删除所选
              </Button>
            </Space>
          )
          : (
            <Button
              type="primary"
              danger
              onClick={() => this.handleBatchDelete(false)}
              loading={loading.effects["songs/trash"]}
            >
              删除所选
            </Button>
          )}
        <Modal
          open={modalVisible}
          onCancel={this.handleCancel}
          confirmLoading={loading.effects["songs/save"]}
          okText="保存"
          title="编辑曲目"
          onOk={this.handleSave}
          forceRender
          centered
        >
          <Form ref={this.form} labelCol={{ span: 3 }}>
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
                onPressEnter={this.handleSave}
              />
            </FormItem>
            <FormItem label="来源" name="origin">
              <Input
                placeholder="来源"
                maxLength={200}
                onPressEnter={this.handleSave}
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
                  },
                },
              ]}
            >
              <TagsSelect placeholder="曲目标签" />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(({ songs, loading }) => ({ songs, loading }))(Songs);
