import React, { useState } from "react";
import { Form, Table, Button, Input, Modal } from "antd";
import { timeFilters } from "config";
import InlineForm from "components/admin/InlineForm";
import { InlineFormRow } from "components/admin/InlineForm";
import Title from "hooks/useTitle";
import { useRank } from "services/admin/rank";

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

const Rank = () => {
  const rank = useRank();
  const [showResult, setShowResult] = useState(false);

  const handleCancel = () => {
    setShowResult(false);
  };

  const result = () => {
    let result = JSON.parse(JSON.stringify(rank.data)); //!important:  Copy Array
    result.forEach((v) => {
      delete v.sum;
      delete v.counts;
    });
    return JSON.stringify(result);
  };

  const renderExpanded = (row) => (
    <InlineForm>
      <InlineFormRow>
        <FormItem label="时段">{row.playtime}</FormItem>
        <FormItem label="曲名">{row.name}</FormItem>
        <FormItem label="来源">{row.origin}</FormItem>
      </InlineFormRow>
      <InlineFormRow>
        <FormItem label="得分">{row.score}</FormItem>
        <FormItem label="总分">{row.sum}</FormItem>
        <FormItem label="票数">{row.counts}</FormItem>
      </InlineFormRow>
      <InlineFormRow>
        <FormItem label="试听">
          <audio src={row.url} controls="controls" preload="none" />
        </FormItem>
      </InlineFormRow>
    </InlineForm>
  );

  return (
    <>
      <Title>投票结果</Title>
      <Table
        dataSource={rank.data}
        columns={columns}
        loading={rank.isLoading}
        expandedRowRender={renderExpanded}
        scroll={{ x: 600 }}
        rowKey="id"
      />
      <Button type="primary" onClick={() => setShowResult(true)}>
        生成结果
      </Button>
      {showResult && (
        <Modal
          open={showResult}
          onCancel={handleCancel}
          title="生成投票结果"
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              关闭
            </Button>
          ]}
          style={{ top: "70px" }}
        >
          <TextArea value={result()} autoSize={{ minRows: 6, maxRows: 10 }} />
        </Modal>
      )}
    </>
  );
};

export default Rank;
