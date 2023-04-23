import { Table } from "antd";
import { timeIdToText, timeFilters } from "config";
import { useMyUploads } from "services/upload";

const ViewUploads = () => {
  const { data, isLoading } = useMyUploads();

  const columns = [
    {
      dataIndex: "playtime",
      title: "时段",
      width: 70,
      render: (text) => timeIdToText[text],
      filters: timeFilters,
      onFilter: (value, record) => record.playtime === value
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
        dataSource={data}
        columns={columns}
        loading={isLoading}
        pagination={false}
        rowKey={(record) => record.playtime + record.name}
        scroll={{ x: 600 }}
      />
    </div>
  );
};

export default ViewUploads;
