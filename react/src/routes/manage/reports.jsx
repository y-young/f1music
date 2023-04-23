import React, { useState } from "react";
import { Form, Table, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import InlineForm, { InlineFormRow } from "components/admin/InlineForm";
import Title from "hooks/useTitle";
import { useReports } from "services/admin/reports";

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

const Reports = () => {
  const { del, ...reports } = useReports();
  const list = reports.data ?? [];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleDelete = (id) =>
    del
      .trigger(id)
      .then(() => message.success("操作成功"))
      .catch(() => {});

  const handleBatchDelete = () =>
    handleDelete(selectedRowKeys).then(() => setSelectedRowKeys([]));

  const renderExpanded = (row) => (
    <div>
      <InlineForm>
        <InlineFormRow>
          <FormItem label="曲目ID">{row.song_id}</FormItem>
          <FormItem label="内容">{row.reason}</FormItem>
          <FormItem label="时间">{row.time}</FormItem>
        </InlineFormRow>
        <InlineFormRow>
          <FormItem label="试听">
            <audio src={row.song.file.url} controls="controls" preload="none" />
          </FormItem>
          <FormItem label="操作">
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              loading={del.isMutating}
              onClick={() => handleDelete([row.id])}
            >
              删除
            </Button>
          </FormItem>
        </InlineFormRow>
      </InlineForm>
    </div>
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE
    ]
  };

  return (
    <>
      <Title>反馈</Title>
      <div style={{ fontSize: "14px", color: "#777" }}>
        反馈总数: {list.length} 条 已选中: {selectedRowKeys.length} 条
      </div>
      <br />
      <Table
        dataSource={list}
        columns={columns}
        rowSelection={rowSelection}
        expandedRowRender={renderExpanded}
        expandable={{ expandRowByClick: true }}
        rowKey="id"
        scroll={{ x: 600 }}
        loading={reports.isValidating}
        style={{ width: "100%" }}
      />
      <Button
        type="primary"
        danger
        loading={del.isMutating}
        onClick={handleBatchDelete}
        disabled={selectedRowKeys.length === 0}
      >
        删除所选
      </Button>
    </>
  );
};

export default Reports;
