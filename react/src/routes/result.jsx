import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Space, Table, Tabs } from "antd";
import "aplayer/dist/APlayer.min.css";
import APlayer from "aplayer";
import Player from "components/Player";
import { timeFilters, timeIdToText } from "config";
import { ArrowRightOutlined, DownloadOutlined } from "@ant-design/icons";
import Title from "hooks/useTitle";

const columns = [
  {
    dataIndex: "playtime",
    title: "时段",
    width: 90,
    render: (text) => {
      return timeIdToText[text];
    },
    filters: timeFilters,
    onFilter: (value, record) => record.playtime === value,
  },
  { dataIndex: "name", title: "曲名", width: 200 },
  { dataIndex: "origin", title: "来源", width: 200 },
  {
    dataIndex: "score",
    title: "得分",
    width: 90,
    sorter: (a, b) => a.score - b.score,
  },
  {
    title: "试听",
    width: 150,
    render: (text, record) => {
      return <Player mini src={record.url} />;
    },
  },
  {
    title: "下载",
    render: (text, record) => {
      return (
        <Button
          icon={<DownloadOutlined />}
          href={`/api/download/${record.id}`}
        />
      );
    },
  },
];
const rank = []; // Replace [] with results generated on admin/rank

const Result = () => {
  const containerRef = useRef();

  const loadPlayer = () => {
    axios
      .get("/music/playlist")
      .then((response) => {
        // eslint-disable-next-line no-new
        new APlayer({
          container: containerRef.current,
          mini: false,
          autoplay: false,
          loop: "all",
          listFolded: false,
          audio: response.data,
        });
      })
      .catch(console.log);
  };

  useEffect(() => {
    loadPlayer();
  }, []);

  return (
    <>
      <Title>投票结果</Title>
      <Tabs
        defaultActiveKey="songs"
        items={[
          {
            key: "songs",
            label: "当选歌曲",
            children: <div ref={containerRef} />,
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
            ),
          },
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
    </>
  );
};

export default Result;
