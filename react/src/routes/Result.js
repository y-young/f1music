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
const rank = [
  {
    id: 676,
    playtime: "1",
    name: "Whisper of Stream",
    origin: "a_hisa",
    score: 3.5714285714285716,
    url: "/uploads/e3d0745927183fe4286155c54d85db64.mp3"
  },
  {
    id: 109,
    playtime: "1",
    name: "ハルノウタ",
    origin: "ハム",
    score: 2.7419354838709675,
    url: "/uploads/20ef697acd91a9cae37891f6d23bc963.mp3"
  },
  {
    id: 441,
    playtime: "1",
    name: "heaven sunshine",
    origin: "Foxtail-Grass Studio",
    score: 2.2674418604651163,
    url: "/uploads/f4e961d12477db0f18fd9600bb80a177.mp3"
  },
  {
    id: 439,
    playtime: "1",
    name: "Our Story",
    origin: "Composer：V.K克",
    score: 2.0618556701030926,
    url: "/uploads/c68f6098bdaa9552a723fbe8f14a21bf.mp3"
  },
  {
    id: 75,
    playtime: "1",
    name: "Snow halation",
    origin: "はみ",
    score: 1.875,
    url: "/uploads/256a507e62bd986b64eb0b9e173f275c.mp3"
  },
  {
    id: 54,
    playtime: "1",
    name: "五月晴れの空の下",
    origin: "森まもる",
    score: 0.6976744186046512,
    url: "/uploads/945fbf87c34dd37ad1591fc5706623cf.mp3"
  },
  {
    id: 72,
    playtime: "1",
    name: "Corporate Dreams",
    origin: "Capo Productions",
    score: 0.5882352941176471,
    url: "/uploads/49076515b04d3fe52274c228d3d7fcdc.mp3"
  },
  {
    id: 287,
    playtime: "1",
    name: "新起点",
    origin: "争持Zill",
    score: 0.5232558139534884,
    url: "/uploads/1cc77cb8820ebd3fd1af833b0361dd78.mp3"
  },
  {
    id: 70,
    playtime: "1",
    name: "The Making of It All",
    origin: "Francois Maugame",
    score: -0.975609756097561,
    url: "/uploads/7f60e2785eb0d7362e123fadccaaf621.mp3"
  },
  {
    id: 118,
    playtime: "2",
    name: "Lupinus",
    origin: "Foxtail-Grass Studio",
    score: 3,
    url: "/uploads/2544d4d4b1867392666f919ed2caf7b5.mp3"
  },
  {
    id: 297,
    playtime: "2",
    name: "僕たちはひとつの光 (Off Vocal)",
    origin: "μ's",
    score: 1.7567567567567568,
    url: "/uploads/3b3847e664afd75c4e821dbf5e29e021.mp3"
  },
  {
    id: 635,
    playtime: "2",
    name: "二人セゾン",
    origin: "欅坂46",
    score: 1.6153846153846154,
    url: "/uploads/3394e556c38f760ec3daaee5dd759873.mp3"
  },
  {
    id: 721,
    playtime: "2",
    name: "M♭ (Off Vocal Ver.)",
    origin: "冴えない彼女の育てかた キャラクターイメージソング 加藤恵",
    score: 1.3636363636363635,
    url: "/uploads/0a01de9914225f73ab7d94bf96185359.mp3"
  },
  {
    id: 737,
    playtime: "2",
    name: "仆的夏恋",
    origin: "V.K克",
    score: 1.1428571428571428,
    url: "/uploads/53d277d7a808870d53a0f6dce001285c.mp3"
  },
  {
    id: 631,
    playtime: "2",
    name: "青空が違う",
    origin: "欅坂46",
    score: 0.819672131147541,
    url: "/uploads/d75143cccd40e1893eaafa03ace176ff.mp3"
  },
  {
    id: 492,
    playtime: "2",
    name: "笑顔のままで (instrument)",
    origin: "幽玄花影",
    score: -1.2878787878787878,
    url: "/uploads/96b9fe15a73bc2bd3bb7ae213e36ed6d.mp3"
  },
  {
    id: 12,
    playtime: "2",
    name: "Bloomin' LIghts",
    origin: "a_hisa",
    score: -1.3043478260869565,
    url: "/uploads/df138e657bb19055e9d45e94918eafd7.mp3"
  },
  {
    id: 99,
    playtime: "2",
    name: "白石溪伴奏",
    origin: "热门华语283",
    score: -1.4189189189189189,
    url: "/uploads/9ecd86ace6d9b4b8877a9414efaa10b7.mp3"
  },
  {
    id: 438,
    playtime: "2",
    name: "Fairytale",
    origin: "Composer：Chito$e。From：Arcaea",
    score: -2.6515151515151514,
    url: "/uploads/cc358ed5c887d51510eb13e687656171.mp3"
  },
  {
    id: 371,
    playtime: "3",
    name: "鬼酒時雨",
    origin: "魂音泉 空オーケストラ ～たまオケ～2",
    score: 2.6515151515151514,
    url: "/uploads/659f3fd7275b719b2850291b7fe0ae6f.mp3"
  },
  {
    id: 496,
    playtime: "3",
    name: "恋におちたら image version",
    origin: "松下奈緒",
    score: 2.5,
    url: "/uploads/8a94b3b58175f0fa6938245c28099efa.mp3"
  },
  {
    id: 520,
    playtime: "3",
    name: "Mountain Journey",
    origin: "Foxtail-Grass Studio",
    score: 2.421875,
    url: "/uploads/61f35f6a585da9d1e19159d47beeab2d.mp3"
  },
  {
    id: 738,
    playtime: "3",
    name: "僕らの手には何もないけど、[Instrumental]",
    origin: "RAM WIRE",
    score: 2.2033898305084745,
    url: "/uploads/8a4ba04d12495c4e77318e8a102a9be7.mp3"
  },
  {
    id: 416,
    playtime: "3",
    name: "Evolution Era",
    origin: "Composer：V.K克。From：Deemo",
    score: 1.3559322033898304,
    url: "/uploads/0861415fd1879567456cc3bae529f5a7.mp3"
  },
  {
    id: 25,
    playtime: "3",
    name: "Letter",
    origin: "iris",
    score: 0.8870967741935484,
    url: "/uploads/5e993a9e27b3e095deef1fafe7d56c88.mp3"
  },
  {
    id: 4,
    playtime: "3",
    name: "帰路 - KaeriMichi -",
    origin: null,
    score: 0.873015873015873,
    url: "/uploads/a9573e182f172acd85928ac2698bd6d5.mp3"
  },
  {
    id: 249,
    playtime: "3",
    name: "Yuri on ICE",
    origin: "梅林太郎",
    score: -0.9615384615384616,
    url: "/uploads/cdd36f8d5f013ef885056e7591e9d8af.mp3"
  },
  {
    id: 28,
    playtime: "3",
    name: "West Coast",
    origin: "Czech Philharmonic Orchestra",
    score: -1.320754716981132,
    url: "/uploads/2b85ef32d53900f54f4da65a23a8241a.mp3"
  },
  {
    id: 444,
    playtime: "4",
    name: "一封孤岛的信（伴奏）",
    origin: "著小生zoki",
    score: 2.4489795918367347,
    url: "/uploads/39de59fbc677c13d273c20de02a62cdd.mp3"
  },
  {
    id: 463,
    playtime: "4",
    name: "夏日",
    origin: "四季音色",
    score: 1.7924528301886793,
    url: "/uploads/32c83e77090dcd92a777a85850a1f768.mp3"
  },
  {
    id: 568,
    playtime: "4",
    name: "Komorebi",
    origin: "m-taku",
    score: 1.7777777777777777,
    url: "/uploads/361628fe4c3b110de884fa7bcb52b345.mp3"
  },
  {
    id: 648,
    playtime: "4",
    name: "Mother Earth",
    origin: "Piano Master",
    score: 1.4130434782608696,
    url: "/uploads/1931a9c03b60efe7123205b7b7760244.mp3"
  },
  {
    id: 274,
    playtime: "4",
    name: "KEYS - PIANO SKETCH",
    origin: "ZYTOKINE",
    score: 1.25,
    url: "/uploads/676a2e33e9b192514e90ce23fb5633d6.mp3"
  },
  {
    id: 69,
    playtime: "4",
    name: "BLISS",
    origin: "Ken Arai",
    score: 1.0869565217391304,
    url: "/uploads/38b0332e0e4c3392945a751305ab1c96.mp3"
  },
  {
    id: 630,
    playtime: "4",
    name: "Silent express",
    origin: null,
    score: 0.851063829787234,
    url: "/uploads/e5735875f1687e0b44b736f56598f487.mp3"
  },
  {
    id: 37,
    playtime: "4",
    name: "At The Edge",
    origin: "千坂",
    score: 0.5357142857142857,
    url: "/uploads/cdf4eb99055d1fdabaec76276c9d9e1e.mp3"
  },
  {
    id: 733,
    playtime: "4",
    name: "Ephemeral Memories",
    origin: "MoreanP",
    score: 0,
    url: "/uploads/3c95b474b425756a52459e425e6b9b2b.mp3"
  },
  {
    id: 526,
    playtime: "4",
    name: "昨夜星河",
    origin: "Rain Lyc",
    score: -1.8604651162790697,
    url: "/uploads/d8267df617d890d8434db72aa2344a05.mp3"
  },
  {
    id: 489,
    playtime: "4",
    name: "Life Is A Journey",
    origin: "Piano Master",
    score: -2,
    url: "/uploads/b193c29eb78373719084a4e06b70837b.mp3"
  },
  {
    id: 277,
    playtime: "5",
    name: "寂静之空",
    origin: "傅许",
    score: 2.2641509433962264,
    url: "/uploads/2151d2f66ce9ec18e7ee1f6c81827f88.mp3"
  },
  {
    id: 200,
    playtime: "5",
    name: "hometown",
    origin: "まももP",
    score: 2.1818181818181817,
    url: "/uploads/c64b3408873da6bed3e745384b000298.mp3"
  },
  {
    id: 79,
    playtime: "5",
    name: "you",
    origin: "M.Graveyard",
    score: 2.1,
    url: "/uploads/687e8948889fa76b13afda1bd11b93d0.mp3"
  },
  {
    id: 465,
    playtime: "5",
    name: "夏の喚く",
    origin: "邱有句,AirS1991",
    score: 2.0408163265306123,
    url: "/uploads/d7cff87ae5bfdb72fe398bef87549a1a.mp3"
  },
  {
    id: 433,
    playtime: "5",
    name: "夜の向日葵",
    origin: "素晴らしき日々 サウンドトラックCD",
    score: 1.530612244897959,
    url: "/uploads/741bb3b0a64304c98a2145a1724788fd.mp3"
  },
  {
    id: 736,
    playtime: "5",
    name: "桜乃 -City of fairy tale-",
    origin: "V.A.",
    score: 1.4130434782608696,
    url: "/uploads/62c05de680f64acc4f099032a78c9559.mp3"
  },
  {
    id: 41,
    playtime: "5",
    name: "Journey",
    origin: "Capo Productions",
    score: 1.0204081632653061,
    url: "/uploads/724d2a737854bad44c5c9945592daecc.mp3"
  },
  {
    id: 306,
    playtime: "5",
    name: "蒼の彼方へ",
    origin: "蒼の彼方のフォーリズム Piano Album #1",
    score: 0.5555555555555556,
    url: "/uploads/0c67428f289c9c575849f4cc4b37d317.mp3"
  },
  {
    id: 627,
    playtime: "5",
    name: "絆",
    origin: "",
    score: -0.1111111111111111,
    url: "/uploads/66c52c240a286730fb71a3bf7c616ecf.mp3"
  },
  {
    id: 201,
    playtime: "5",
    name: "Sad Machine (Xeuphoria's Goodbye Ver.)",
    origin: "Xeuphoria",
    score: -0.45454545454545453,
    url: "/uploads/9874b3ec9e908eecdc88691355dc02e5.mp3"
  },
  {
    id: 239,
    playtime: "6",
    name: "Cry for the moon",
    origin: "出羽良彰",
    score: 3.2142857142857144,
    url: "/uploads/355c9629e3aebf46b571f9ee227e5119.mp3"
  },
  {
    id: 44,
    playtime: "6",
    name: "需要人陪",
    origin: "《夜色钢琴曲》",
    score: 2.622950819672131,
    url: "/uploads/5bc0bb77af345684fae533b6d1ba1bf3.mp3"
  },
  {
    id: 734,
    playtime: "6",
    name: "Wings of Courage ピアノアレンジ1",
    origin: "Elements Garden",
    score: 1.6964285714285714,
    url: "/uploads/4e799526b6681c2b9cf300c0fed4ae67.mp3"
  },
  {
    id: 174,
    playtime: "6",
    name: "Memories from Days Far Away",
    origin: "Eminence Symphony Orchestra",
    score: 1.6666666666666667,
    url: "/uploads/c98bbc3aa02dcde86c62eba6af40bcf1.mp3"
  },
  {
    id: 128,
    playtime: "6",
    name: "恋 Piano ver. [Instrumental]",
    origin: "末廣健一郎",
    score: 0.7692307692307693,
    url: "/uploads/81c509a0a6ba486b4b851788e2e5582c.mp3"
  },
  {
    id: 33,
    playtime: "6",
    name: "ネクロファンタジア",
    origin: "はちみつれもん",
    score: 0.5660377358490566,
    url: "/uploads/23d25dcf185fe36d0ecb67b1659dee60.mp3"
  },
  {
    id: 497,
    playtime: "6",
    name: "Still...",
    origin: "オルゴール",
    score: 0.44642857142857145,
    url: "/uploads/accbffa64e71266d5c82534ac935e23a.mp3"
  },
  {
    id: 482,
    playtime: "6",
    name: "Felicity",
    origin: null,
    score: 0.18518518518518517,
    url: "/uploads/b241fd490c144103ccd9daff7b8fef98.mp3"
  },
  {
    id: 735,
    playtime: "6",
    name: "last train home ~ still far",
    origin: "麗美",
    score: -1.0576923076923077,
    url: "/uploads/ba1634e7a6895b4c4a5ef1e7d7d00d21.mp3"
  }
];

class Result extends React.Component {
  state = {
    player: null,
    audio: []
  };

  componentDidMount() {
    this.loadPlayer();
  }
  loadPlayer = () => {
    axios.get("/playlist").then(response => {
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
        <a
          href="http://music.163.com/playlist/2621168336"
          className="redirect"
        >
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
