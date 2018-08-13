import React from "react";
import { connect } from "dva";
import { Table, Button, Input, Form, Modal } from "antd";
import { TimeSelector } from "components/admin";

const FormItem = Form.Item;
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
    width: "70px",
    filters: [
      { text: "6:30", value: "1" },
      { text: "7:00", value: "2" },
      { text: "13:45", value: "3" },
      { text: "18:40", value: "4" },
      { text: "21:35", value: "5" },
      { text: "22:30", value: "6" }
    ],
    onFilter: (value, record) => record.playtime === value
  },
  { dataIndex: "name", title: "曲名" },
  {
    dataIndex: "reports_count",
    title: "举报数",
    sorter: (a, b) => a.reports_count - b.reports_count
  },
  { dataIndex: "created_at", title: "时间" }
];

class Songs extends React.Component {
  state = {
    selectedRowKeys: [],
    modalVisible: false,
    row: null
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys: selectedRowKeys });
  };

  editSong = row => {
    this.props.form.resetFields();
    this.setState({ row: row, modalVisible: true });
  };

  handleSave = () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({ type: "songs/save", payload: values }).then(success => {
          if (success) {
            this.setState({ modalVisible: false });
          }
        });
      }
    });
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
    console.log(this.state.selectedRowKeys);
    console.log(isDelete);
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
          <FormItem label="创建时间">{row.created_at}</FormItem>
          <FormItem label="最后更新时间">{row.updated_at}</FormItem>
          {type === "trashed" && (
            <FormItem label="删除时间">{row.deleted_at}</FormItem>
          )}
          <br />
          <FormItem label="试听">
            <audio src={row.file.url} controls="controls" />
          </FormItem>
          <FormItem label="操作">
            <Button
              type="primary"
              icon="edit"
              onClick={() => this.editSong(row)}
            >
              编辑
            </Button>
            {type === "trashed" ? (
              <span>
                <Button
                  type="secondary"
                  icon="rollback"
                  onClick={() => this.handleRestore([row.id])}
                  loading={loading.effects["songs/restore"]}
                >
                  恢复
                </Button>
                <Button
                  type="danger"
                  icon="delete"
                  onClick={() => this.handleDelete([row.id], true)}
                  loading={loading.effects["songs/delete"]}
                >
                  彻底删除
                </Button>
              </span>
            ) : (
              <Button
                type="danger"
                icon="delete"
                onClick={() => this.handleDelete([row.id])}
                loading={loading.effects["songs/trash"]}
              >
                删除
              </Button>
            )}
          </FormItem>
        </Form>
      </div>
    );
  };

  render() {
    const { songs, loading, form } = this.props;
    const { type, list } = songs;
    const { getFieldDecorator } = form;
    const { selectedRowKeys, row, modalVisible } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <div>
        <div style={{ fontSize: "14px", color: "#777" }}>
          曲目总数: {list.length} 首 已选中: {selectedRowKeys.length} 首
        </div>
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
        {row && (
          <Modal
            visible={modalVisible}
            onCancel={this.handleCancel}
            confirmLoading={loading.effects["songs/save"]}
            okText="保存"
            title="编辑曲目"
            onOk={this.handleSave}
            centered
            //            style={{ top: "60px" }}
          >
            <Form>
              {getFieldDecorator("id", { initialValue: row.id })(
                <Input type="hidden" />
              )}
              <FormItem label="时段">
                {getFieldDecorator("playtime", { initialValue: row.playtime })(
                  <TimeSelector style={{ width: "120px" }} />
                )}
              </FormItem>
              <FormItem label="曲名">
                {getFieldDecorator("name", {
                  initialValue: row.name,
                  rules: [{ required: true, message: "请填写曲名" }]
                })(<Input placeholder="曲名" />)}
              </FormItem>
              <FormItem label="来源">
                {getFieldDecorator("origin", { initialValue: row.origin })(
                  <Input placeholder="来源" />
                )}
              </FormItem>
            </Form>
          </Modal>
        )}
        {type === "trashed" ? (
          <span>
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
          </span>
        ) : (
          <Button
            type="danger"
            onClick={() => this.handleBatchDelete(false)}
            loading={loading.effects["songs/trash"]}
          >
            删除所选
          </Button>
        )}
      </div>
    );
  }
}

export default connect(({ songs, loading }) => ({ songs, loading }))(
  Form.create()(Songs)
);
