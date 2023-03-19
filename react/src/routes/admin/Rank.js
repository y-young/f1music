import React from "react";
import { connect } from "dva";
import { Form, Table, Button, Input, Modal } from "antd";
import { timeFilters } from "config";

const { TextArea } = Input;
const FormItem = Form.Item;
const columns = [
  { dataIndex: "id", title: "#", width: "60px" },
  {
    dataIndex: "playtime",
    title: "时段",
    width: "70px",
    filters: timeFilters,
    onFilter: (value, record) => record.playtime === value
  },
  { dataIndex: "name", title: "曲名" },
  {
    dataIndex: "score",
    title: "得分",
    sorter: (a, b) => a.score - b.score
  },
  {
    dataIndex: "sum",
    title: "总分",
    sorter: (a, b) => a.sum - b.sum
  },
  {
    dataIndex: "counts",
    title: "投票人数",
    sorter: (a, b) => a.counts - b.counts
  }
];

class Rank extends React.Component {
  state = {
    showResult: false
  };

  handleCancel = () => {
    this.setState({ showResult: false });
  };

  result = () => {
    const { rank } = this.props;
    const { voteResult } = rank;
    let result = JSON.parse(JSON.stringify(voteResult)); //!important:  Copy Array
    result.forEach(v => {
      delete v.sum;
      delete v.counts;
    });
    return JSON.stringify(result);
  };

  renderExpanded = row => {
    return (
      <div>
        <Form layout="inline">
          <FormItem label="时段">{row.playtime}</FormItem>
          <FormItem label="曲名">{row.name}</FormItem>
          <FormItem label="来源">{row.origin}</FormItem>
          <FormItem label="得分">{row.score}</FormItem>
          <FormItem label="总分">{row.sum}</FormItem>
          <FormItem label="票数">{row.counts}</FormItem>
          <FormItem label="试听">
            <audio src={row.url} controls="controls" preload="none" />
          </FormItem>
        </Form>
      </div>
    );
  };

  render() {
    const { rank, loading } = this.props;
    const { voteResult } = rank;
    return (
      <div>
        <Table
          dataSource={voteResult}
          columns={columns}
          loading={loading.effects["rank/fetch"]}
          expandedRowRender={this.renderExpanded}
          scroll={{ x: 600 }}
          rowKey="id"
        />
        <Button
          type="primary"
          onClick={() => this.setState({ showResult: true })}
        >
          生成结果
        </Button>
        {this.state.showResult && (
          <Modal
            open={this.state.showResult}
            onCancel={this.handleCancel}
            title="生成投票结果"
            footer={[
              <Button key="cancel" onClick={this.handleCancel}>
                关闭
              </Button>
            ]}
            style={{ top: "70px" }}
          >
            <TextArea
              value={this.result()}
              autoSize={{ minRows: 6, maxRows: 10 }}
            />
          </Modal>
        )}
      </div>
    );
  }
}

export default connect(({ rank, loading }) => ({ rank, loading }))(Rank);
