import React, { useEffect, useRef } from "react";
import { Link } from "dva/router";
import axios from "axios";
import { Tabs, Table, Button, Space } from "antd";
import "aplayer/dist/APlayer.min.css";
import APlayer from "aplayer";
import YPlayer from "components/YPlayer";
import { timeIdToText, timeFilters } from "config";
import { DownloadOutlined, ArrowRightOutlined } from "@ant-design/icons";

const columns = [
  {
    dataIndex: "playtime",
    title: "时段",
    width: 90,
    render: text => {
      return timeIdToText[text];
    },
    filters: timeFilters,
    onFilter: (value, record) => record.playtime === value
  },
  { dataIndex: "name", title: "曲名", width: 200 },
  { dataIndex: "origin", title: "来源", width: 200 },
  {
    dataIndex: "score",
    title: "得分",
    width: 90,
    sorter: (a, b) => a.score - b.score
  },
  {
    title: "试听",
    width: 150,
    render: (text, record) => {
      return <YPlayer src={record.url} mini />;
    }
  },
  {
    title: "下载",
    render: (text, record) => {
      return (
        <Button
          type="secondary"
          icon={<DownloadOutlined />}
          href={"/api/download/" + record.id}
        />
      );
    }
  }
];
const rank = []; // Replace [] with results generated on admin/rank

const Result = () => {
  const containerRef = useRef();

  useEffect(() => {
    loadPlayer();
  }, []);

  const loadPlayer = () => {
    axios.get("/music/playlist").then(response => {
      new APlayer({
        container: containerRef.current,
        mini: false,
        autoplay: false,
        loop: "all",
        listFolded: false,
        audio: response.data
      });
    });
  };

  return (
    <div>
      <Tabs
        defaultActiveKey="songs"
        items={[
          {
            key: "songs",
            label: "当选歌曲",
            children: <div ref={containerRef} />
          },
          {
            key: "rank",
            label: "投票结果",
            children: (
              <Table
                dataSource={rank}
                columns={columns}
                rowKey="id"
                scroll={{ x: 700 }}
              />
            )
          }
        ]}
      />
      <br />
      <Space>
        <a
          href="http://music.163.com/playlist/" // Put playlist link here
          className="redirect"
        >
          前往网易云歌单
          <ArrowRightOutlined />
        </a>
        <Link to="/home" className="redirect">
          进入首页
          <ArrowRightOutlined />
        </Link>
      </Space>
    </div>
  );
};

export default Result;
