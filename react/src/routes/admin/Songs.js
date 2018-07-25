import React from "react";
import { connect } from "dva";
import { Table, Button, Input, Form, Modal } from "antd";
import { TimeSelector } from "components/admin";

const FormItem = Form.Item;
const columns = [
  { dataIndex: "id", title: "#", width: "60px" },
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
    selected: [],
    modalVisible: false,
    row: null
  };

  editSong = row => {
    this.setState({ row: row, modalVisible: true });
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({ type: "songs/delete", payload: id });
  }

  renderExpanded = row => {
    const { songs, dispatch } = this.props;
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
                <Button type="secondary" icon="rollback">
                  恢复
                </Button>
                <Button type="danger" icon="delete">
                  彻底删除
                </Button>
              </span>
            ) : (
              <Button type="danger" icon="delete">
                删除
              </Button>
            )}
          </FormItem>
        </Form>
      </div>
    );
  };

  render() {
    const { songs, dispatch, loading, form } = this.props;
    const { type, list } = songs;
    const { getFieldDecorator } = form;
    const { selected, row } = this.state;

    return (
      <div>
        <div style={{ fontSize: "14px", color: "#777" }}>
          曲目总数: {list.length} 首 已选中: {selected.length} 首
        </div>
        <br />
        <Table
          dataSource={list}
          columns={columns}
          expandedRowRender={this.renderExpanded}
          loading={loading.effects["songs/fetch"]}
          rowKey="id"
          scroll={{ x: 600 }}
          style={{ width: "100%" }}
        />
        {row && (
          <Modal
            visible={this.state.modalVisible}
            onCancel={this.handleCancel}
            title="编辑曲目"
            footer={[
              <Button key="cancel" onClick={this.handleCancel}>
                取消
              </Button>,
              <Button key="save" type="primary">
                保存
              </Button>
            ]}
            style={{ top: "70px" }}
          >
            <Form>
              <FormItem label="时段">
                {getFieldDecorator("playtime", { initialValue: row.playtime })(
                  <TimeSelector style={{ width: "120px" }} />
                )}
              </FormItem>
              <FormItem label="曲名">
                {getFieldDecorator("name", {
                  initialValue: row.name,
                  rules: [{ required: true }]
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
          <Button type="danger">彻底删除所选</Button>
        ) : (
          <Button type="danger">删除所选</Button>
        )}
      </div>
    );
  }
}

export default connect(({ songs, loading }) => ({ songs, loading }))(
  Form.create()(Songs)
);
