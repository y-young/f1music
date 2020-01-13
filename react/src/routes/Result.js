import React from "react";
import { Link } from "dva/router";
import axios from "axios";
import { Icon, Tabs, Table, Button } from "antd";
import "aplayer/dist/APlayer.min.css";
import APlayer from "aplayer";
import YPlayer from "components/YPlayer";
import { timeIdToText, timeFilters } from "config";

const TabPane = Tabs.TabPane;
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
          icon="download"
          href={"/api/download/" + record.id}
        />
      );
    }
  }
];
const rank = []; //Replace [] with results generated on admin/rank

class Result extends React.Component {
  state = {
    player: null,
    audio: []
  };

  componentDidMount() {
    this.loadPlayer();
  }
  loadPlayer = () => {
    axios.get("/music/playlist").then(response => {
      this.setState({ audio: response.data });
      new APlayer({
        container: this.container,
        mini: false,
        autoplay: false,
        loop: "all",
        listFolded: false,
        audio: this.state.audio
      });
    });
  };

  render() {
    return (
      <div>
        <Tabs defaultActiveKey="songs">
          <TabPane tab="当选歌曲" key="songs">
            <div ref={el => (this.container = el)} />
          </TabPane>
          <TabPane tab="投票结果" key="rank">
            <Table
              dataSource={rank}
              columns={columns}
              rowKey="id"
              scroll={{ x: 700 }}
            />
          </TabPane>
        </Tabs>
        <br />
        <a href="http://music.163.com/playlist/2621168336" className="redirect">
          前往网易云歌单
          <Icon type="arrow-right" />
        </a>
        <Link to="/home" className="redirect">
          进入首页
          <Icon type="arrow-right" />
        </Link>
      </div>
    );
  }
}

export default Result;
