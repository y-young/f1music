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
const rank = [{"id":1,"playtime":"1","name":"ユキトキ","origin":"やなぎなぎ","score":10,"url":"/uploads/c295888f39e3cf7b39a450f87b66fd3d.mp3"},{"id":10,"playtime":"1","name":"ne! ne! ne!","origin":"STARTails☆","score":10,"url":"/uploads/d9a8ab03a452936729f1ebe27df59136.mp3"},{"id":2,"playtime":"1","name":"終わりの世界から","origin":"やなぎなぎ,麻枝准","score":5,"url":"/uploads/077b8bce3127587740d8e22d28829d72.mp3"},{"id":19,"playtime":"1","name":"少女綺想曲 ~Dream Battle","origin":"東方幻華楽・弐 ~ドラム","score":5,"url":"/uploads/124ab905592e71fe93b6ac7c60cf37eb.mp3"},{"id":20,"playtime":"1","name":"少女綺想曲 ~Dream Battle","origin":"幻華楽","score":5,"url":"/uploads/fd5cc98065aae3f9cd027a2571aecfd2.mp3"},{"id":5,"playtime":"2","name":"君の知らない物語","origin":"Supercell","score":10,"url":"/uploads/bedd648e9540d6318e00203c3e17bbd8.mp3"},{"id":21,"playtime":"2","name":" 秋姉妹のなく頃に in the autumn sky","origin":"ばんばんしー","score":0,"url":"/uploads/a8c638054f8aad096fa5c3085f395a2b.mp3"},{"id":11,"playtime":"4","name":"竹取飛翔 ～ Lunatic Princess","origin":"Sensitive Heart","score":0,"url":"/uploads/92bbe8b6ee27beaad8d824697e7b5c39.mp3"},{"id":12,"playtime":"4","name":"華鳥風月","origin":"森永真由美","score":0,"url":"/uploads/1a662afdda4768b6ac34ac3c3914490f.mp3"},{"id":22,"playtime":"4","name":"Doors~勇気の軌跡~ (オリジナル・カラオケ)","origin":"Doors～勇気の軌跡～(通常盤)","score":0,"url":"/uploads/70c3453e01b080ddcbeb82fa9d4c9bff.mp3"},{"id":14,"playtime":"5","name":"橙交差点","origin":"まらしぃ","score":0,"url":"/uploads/2db3d19f6c517a436664f1d7ca817395.mp3"},{"id":18,"playtime":"5","name":"砕月 -冬、或る日或る时或る场所で･･･-","origin":"幻想响楽祭","score":0,"url":"/uploads/cf0650ad48c4e87b77e7fd8dd169dd5d.mp3"},{"id":23,"playtime":"5","name":"キセキ","origin":"ケラケラ","score":0,"url":"/uploads/245db03f7772358e317a57ccf95c5c61.mp3"},{"id":13,"playtime":"6","name":"眠月","origin":"まらしぃ","score":10,"url":"/uploads/9a745937391d641516e2b6af54720580.mp3"},{"id":16,"playtime":"6","name":"のんのん日和","origin":"TVアニメ『のんのんびより』ベスト のんのんびより きゃらくたーそんぐ べすと なのん!","score":10,"url":"/uploads/434fe64b1bf7f6620ac27c9a6adfc152.mp3"}];

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
