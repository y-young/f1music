import React from "react";
import { connect } from "dva";
import { Table } from "antd";

const time = {
  "1": "6:30",
  "2": "7:00",
  "3": "13:45",
  "4": "18:40",
  "5": "21:35",
  "6": "22:30"
};

const ViewUploads = ({ upload, loading }) => {
  const { songs } = upload;

  const columns = [
    {
      dataIndex: "playtime",
      title: "时段",
      width: 70,
      render: text => {
        return time[text];
      }
    },
    { dataIndex: "name", title: "曲名", width: 200 },
    {
      dataIndex: "origin",
      title: "来源",
      width: 150
    }
  ];

  return (
    <div>
      <Table
        dataSource={songs}
        columns={columns}
        loading={loading.effects["upload/fetchUploads"]}
        pagination={false}
        rowKey={record => {
          return record.playtime + record.name;
        }}
        scroll={{ x: 600 }}
      />
    </div>
  );
};

export default connect(({ upload, loading }) => ({ upload, loading }))(
  ViewUploads
);
