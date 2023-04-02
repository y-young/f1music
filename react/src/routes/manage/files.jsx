import React from "react";
import { Form, Table } from "antd";
import InlineForm, { InlineFormRow } from "components/admin/InlineForm";
import Title from "hooks/useTitle";
import { useFiles } from "services/admin/files";

const FormItem = Form.Item;

const Files = () => {
  const { data, isLoading } = useFiles();
  const columns = [
    {
      dataIndex: "id",
      title: "#",
      width: "60px",
      sorter: (a, b) => a.id - b.id
    },
    { dataIndex: "md5", title: "MD5" },
    { dataIndex: "time", title: "时间" }
  ];

  const renderExpanded = (row) => {
    return (
      <InlineForm>
        <InlineFormRow>
          <FormItem label="时间">{row.time}</FormItem>
          <FormItem label="时长">{row.duration} 秒</FormItem>
        </InlineFormRow>
        <InlineFormRow>
          <FormItem label="试听">
            <audio controls="controls" src={row.url} preload="none" />
          </FormItem>
        </InlineFormRow>
      </InlineForm>
    );
  };

  return (
    <>
      <Title>文件</Title>
      <div style={{ fontSize: "14px", color: "#777" }}>
        文件总数: {data?.length}个
      </div>
      <br />
      <Table
        dataSource={data}
        expandedRowRender={renderExpanded}
        columns={columns}
        loading={isLoading}
        scroll={{ x: 400 }}
        rowKey="id"
      />
    </>
  );
};

export default Files;
