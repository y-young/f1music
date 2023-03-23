import React, { useState } from "react";
import { connect } from "dva";
import { Form, Table, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import InlineForm, { InlineFormRow } from "components/admin/InlineForm";
import Title from "../../hooks/useTitle";

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

const Reports = ({ reports, dispatch, loading }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleDelete = id => {
    dispatch({ type: "reports/delete", payload: id });
  };

  const handleBatchDelete = () => {
    handleDelete(selectedRowKeys);
    setSelectedRowKeys([]);
  };

  const renderExpanded = row => (
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
              loading={loading.effects["reports/delete"]}
              onClick={() => handleDelete([row.id])}
            >
              删除
            </Button>
          </FormItem>
        </InlineFormRow>
      </InlineForm>
    </div>
  );

  const { list } = reports;
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys
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
        rowKey="id"
        scroll={{ x: 600 }}
        loading={loading.effects["reports/fetch"]}
        style={{ width: "100%" }}
      />
      <Button
        type="primary"
        danger
        loading={loading.effects["reports/delete"]}
        onClick={handleBatchDelete}
      >
        删除所选
      </Button>
    </>
  );
};

export default connect(({ reports, loading }) => ({ reports, loading }))(
  Reports
);
