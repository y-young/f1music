import React from "react";
import { Table } from "and";

const Files = () => {

  const columns = [
    { dataIndex: "id", title: "#", width:"40px" },
    { dataIndex: "md5", title: "MD5" },
    { dataIndex: "time", title: "时间" }
  ];

  const renderExpanded = row => {
    return (
      <div>
        <Form layout="inline">
          <FormItem label="时间">{row.time}</FormItem>
          <FormItem label="试听">
            <audio src={row.url} />
          </FormItem>
        </Form>
      </div>
    );
  };

  return (
    <div>
            <div style={{fontSize: "14px", color: "#777"}}>文件总数:  个</div><br/>
            <Table dataSource={list} style={{width: "100%"}} />
        </div>
  );
};

export default Files;