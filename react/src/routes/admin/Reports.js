import React from "react";
import { connect } from "dva";
import { Form, Table, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import InlineForm, { InlineFormRow } from "components/admin/InlineForm";

const FormItem = Form.Item;
const columns = [
  {
    dataIndex: "id",
    title: "#",
    width: "50px",
    sorter: (a, b) => a.id - b.id
  },
  { dataIndex: ["song", "name"], title: "曲目" },
  { dataIndex: "reason", title: "内容" },
  { dataIndex: "time", title: "时间" }
];

class Reports extends React.Component {
  state = {
    selectedRowKeys: []
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({ type: "reports/delete", payload: id });
  };

  handleBatchDelete = () => {
    this.handleDelete(this.state.selectedRowKeys);
    this.setState({ selectedRowKeys: [] });
  };

  renderExpanded = row => {
    const { loading } = this.props;
    return (
      <div>
        <InlineForm>
          <InlineFormRow>
            <FormItem label="曲目ID">{row.song_id}</FormItem>
            <FormItem label="内容">{row.reason}</FormItem>
            <FormItem label="时间">{row.time}</FormItem>
          </InlineFormRow>
          <InlineFormRow>
            <FormItem label="试听">
              <audio
                src={row.song.file.url}
                controls="controls"
                preload="none"
              />
            </FormItem>
            <FormItem label="操作">
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                loading={loading.effects["reports/delete"]}
                onClick={() => this.handleDelete([row.id])}
              >
                删除
              </Button>
            </FormItem>
          </InlineFormRow>
        </InlineForm>
      </div>
    );
  };

  render() {
    const { reports, loading } = this.props;
    const { list } = reports;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <div>
        <div style={{ fontSize: "14px", color: "#777" }}>
          反馈总数: {list.length} 条 已选中: {selectedRowKeys.length} 条
        </div>
        <br />
        <Table
          dataSource={list}
          columns={columns}
          rowSelection={rowSelection}
          expandedRowRender={this.renderExpanded}
          rowKey="id"
          scroll={{ x: 600 }}
          loading={loading.effects["reports/fetch"]}
          style={{ width: "100%" }}
        />
        <Button
          type="primary"
          danger
          loading={loading.effects["reports/delete"]}
          onClick={this.handleBatchDelete}
        >
          删除所选
        </Button>
      </div>
    );
  }
}

export default connect(({ reports, loading }) => ({ reports, loading }))(
  Reports
);
