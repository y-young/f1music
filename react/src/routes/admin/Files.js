import React from "react";
import { connect } from "dva";
import { Table, Form } from "antd";

const FormItem = Form.Item;

const Files = ({ files, loading }) => {
  const { list } = files;
  const columns = [
    { dataIndex: "id", title: "#", width: "60px" },
    { dataIndex: "md5", title: "MD5" },
    { dataIndex: "time", title: "时间" }
  ];

  const renderExpanded = row => {
    return (
      <div>
        <Form layout="inline">
          <FormItem label="时间">{row.time}</FormItem>
          <FormItem label="试听">
            <audio controls="controls" src={row.url} />
          </FormItem>
        </Form>
      </div>
    );
  };

  return (
    <div>
      <div style={{ fontSize: "14px", color: "#777" }}>
        文件总数: {list.length}个
      </div>
      <br />
      <Table dataSource={list} expandedRowRender={renderExpanded} columns={columns} loading={loading.effects["files/fetch"]} scroll={{x: 400 }} rowKey="id" style={{ width: "100%" }} />
    </div>
  );
};

export default connect(({ files, loading }) => ({ files, loading }))(Files);
