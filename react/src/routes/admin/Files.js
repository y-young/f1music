import React from "react";
import { connect } from "dva";
import { Form, Table } from "antd";
import InlineForm, { InlineFormRow } from "components/admin/InlineForm";
import { Audio } from "components";

const FormItem = Form.Item;

const Files = ({ files, loading }) => {
  const { list } = files;
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

  const renderExpanded = row => {
    return (
      <InlineForm>
        <InlineFormRow>
          <FormItem label="时间">{row.time}</FormItem>
          <FormItem label="时长">{row.duration} 秒</FormItem>
          {row.cloud_id && (
            <FormItem label="云上传ID">
              <a
                href={`https://music.163.com/#/song?id=${row.cloud_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {row.cloud_id}
              </a>
            </FormItem>
          )}
        </InlineFormRow>
        <InlineFormRow>
          <FormItem label="试听">
            <Audio
              controls
              preload="none"
              cloudId={row.cloud_id}
              src={row.url}
            />
          </FormItem>
        </InlineFormRow>
      </InlineForm>
    );
  };

  return (
    <div>
      <div style={{ fontSize: "14px", color: "#777" }}>
        文件总数: {list.length}个
      </div>
      <br />
      <Table
        dataSource={list}
        expandedRowRender={renderExpanded}
        columns={columns}
        loading={loading.effects["files/fetch"]}
        scroll={{ x: 400 }}
        rowKey="id"
      />
    </div>
  );
};

export default connect(({ files, loading }) => ({ files, loading }))(Files);
