import React from "react";
import { connect } from "dva";
import { Table } from "antd";

const ViewUploads = ({ upload, loading }) => {
  const { songs } = upload;

  const columns = [
    { dataIndex: "playtime", title: "时段", width: 50 },
    { dataIndex: "name", title: "曲名", width: 200 },
    {
      dataIndex: "origin",
      title: "来源",
      width: 150
    },
  ];

  return (
    <div> 
      <Table
        dataSource={songs}
        columns={columns}
        loading={loading.effects["upload/fetch"]}
        pagination={false}
        scroll={{ x: 400 }}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default connect(({ upload, loading }) => ({ upload, loading }))(ViewUploads);
