import React from "react";
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

class Songs extends React.Component {
  state = {
    selectedRowKeys: [],
    searchText: "",
    searchColumn: "",
    modalVisible: false
  };
  tagColors = new Map();
  form = React.createRef();

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder="输入关键词"
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
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
            onClick={() => this.handleReset(clearFilters)}
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
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    }
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys: selectedRowKeys });
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
      tags: row.tags
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
      })
      .catch(error => {});
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
    let tagColors = this.tagColors,
      color;
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

    return (
      <div>
        <Form layout="inline">
          <FormItem label="时段">{row.playtime}</FormItem>
          <FormItem label="曲名">{row.name}</FormItem>
          <FormItem label="来源">{row.origin}</FormItem>
          <br />
          <FormItem label="创建时间">{renderDateTime(row.created_at)}</FormItem>
          <FormItem label="最后更新时间">{renderDateTime(row.updated_at)}</FormItem>
          {type === "trashed" && (
            <FormItem label="删除时间">{renderDateTime(row.deleted_at)}</FormItem>
          )}
          <br />
          <FormItem label="试听">
            <audio src={row.file.url} controls="controls" preload="none" />
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
              {type === "trashed" ? (
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
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => this.handleDelete([row.id], true)}
                    loading={loading.effects["songs/delete"]}
                  >
                    彻底删除
                  </Button>
                </Space>
              ) : (
                <Button
                  type="danger"
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
                href={"/api/download/" + row.id}
              >
                下载
              </Button>
            </Space>
          </FormItem>
        </Form>
      </div>
    );
  };

  render() {
    const { songs, loading } = this.props;
    const { type, list } = songs;
    const { selectedRowKeys, modalVisible } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
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
        width: "75px",
        filters: timeFilters,
        onFilter: (value, record) => record.playtime === value
      },
      {
        dataIndex: "name",
        title: "曲名",
        ...this.getColumnSearchProps("name")
      },
      {
        title: "标签",
        key: "tags",
        dataIndex: "tags",
        render: tags => (
          <span>
            {tags.map(tag => {
              if (tag !== "") {
                let color = this.getTagColor(tag);
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
        ...this.getColumnSearchProps("tags")
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
        {type === "trashed" ? (
          <Space>
            <Button
              type="secondary"
              onClick={this.handleBatchRestore}
              loading={loading.effects["songs/restore"]}
            >
              恢复所选
            </Button>
            <Button
              type="danger"
              onClick={() => this.handleBatchDelete(true)}
              loading={loading.effects["songs/delete"]}
            >
              彻底删除所选
            </Button>
          </Space>
        ) : (
          <Button
            type="danger"
            onClick={() => this.handleBatchDelete(false)}
            loading={loading.effects["songs/trash"]}
          >
            删除所选
          </Button>
        )}
        <Modal
          visible={modalVisible}
          onCancel={this.handleCancel}
          confirmLoading={loading.effects["songs/save"]}
          okText="保存"
          title="编辑曲目"
          onOk={this.handleSave}
          forceRender
          centered
        >
          <Form ref={this.form}>
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
                maxLength={50}
                onPressEnter={this.handleSave}
              />
            </FormItem>
            <FormItem label="来源" name="origin">
              <Input
                placeholder="来源"
                maxLength={50}
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
                    if (!value || value.toString().length <= 50) {
                      return Promise.resolve();
                    }
                    return Promise.reject("标签总长度不得超过50");
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
      </div>
    );
  }
}

export default connect(({ songs, loading }) => ({ songs, loading }))(Songs);
