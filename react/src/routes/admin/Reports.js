import React from "react";
import { Table, Form, Button } from "antd";

const FormItem = Form.Item;
const columns = [
  { dataIndex: "id", title: "#", width: "40px" },
  { dataIndex: "song.name", title: "曲目" },
  { dataIndex: "reason", title: "原因" },
  { dataIndex: "time", title: "时间" }
];

class Reports extends React.Component {
  renderExpanded = row => {
    return (
      <div>
        <Form layout="inline">
          <FormItem label="曲目ID">{row.song_id}</FormItem>
          <FormItem label="原因">{row.reason}</FormItem>
          <FormItem label="举报者">{row.reporter}</FormItem>
          <br />
          <FormItem label="时间">{row.time}</FormItem>
          <FormItem label="试听">
            <audio src={row.song.file.url} />
          </FormItem>
          <FormItem label="操作">
            <Button type="danger" icon="delete">
              删除
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  };

  render() {
    const { reports, dispatch, loading } = this.props;
    const { list } = reports;

    return (
      <div>
        <Table
          dataSource={list}
          loading={loading.effects["reports/fetch"]}
          style={{ width: "100%" }}
        />
        <div style={{ marginTop: "20px" }}>
          <Button type="danger">删除所选</Button>
        </div>
      </div>
    );
  }
}

export default connect(({ reports, loading }) => ({ reports, loading }))(
  Reports
);
