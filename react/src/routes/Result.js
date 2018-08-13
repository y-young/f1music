import React from "react";
import { Link } from "dva/router";
import axios from "axios";
import { Icon, Tabs, Table, Button } from "antd";
import "aplayer/dist/APlayer.min.css";
import APlayer from "aplayer";
import YPlayer from "components/YPlayer";

const TabPane = Tabs.TabPane;
const columns = [
  {
    dataIndex: "playtime",
    title: "时段",
    width: 90,
    filters: [
      { text: "6:30", value: "1" },
      { text: "7:00", value: "2" },
      { text: "13:45", value: "3" },
      { text: "18:40", value: "4" },
      { text: "21:35", value: "5" },
      { text: "22:30", value: "6" }
    ],
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
    width: 180,
    render: (text, record) => {
      return <YPlayer src={record.url} mini />
    }
  },
  { title: "下载",
    render: (text, record) => {
      return <Button type="secondary" icon="download" href={"/api/download/" + record.id} />;
    }
  }
];
const rank = [];

class Result extends React.Component {
  state = {
    player: null,
    audio: []
  };

  componentDidMount() {
    this.loadPlayer();
  }
  loadPlayer = () => {
    axios.get("/playlist")
    .then(response => {
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
  }

  render() {
    return (
      <Tabs defaultActiveKey="songs">
        <TabPane tab="当选歌曲" key="songs">
          <div ref={el => this.container = el} /><br />
          <a
            href="http://music.163.com/playlist/2064024722/"
            className="redirect"
          >
            前往网易云歌单<Icon type="arrow-right" />
          </a>
          <Link to="/Home" className="redirect" >
            进入首页<Icon type="arrow-right" />
          </Link>
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
    );
  }
}

export default Result;
