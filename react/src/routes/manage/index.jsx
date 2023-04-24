import Title from "hooks/useTitle";
import TimePeriodDescription from "components/TimePeriodDescription";
import { Typography } from "antd";

const Home = () => {
  return (
    <>
      <Title>首页</Title>
      <Typography>
        <h2 style={{ marginTop: 0 }}>审核须知</h2>
        <p>感谢参与校园音乐审核工作，审核前请仔细阅读以下注意事项。</p>
        审核流程：
        <ol>
          <li>
            上传时同步审核：主要排除不符合硬性要求的曲目，同时留下一个大致印象；此阶段禁止彻底删除曲目
          </li>
          <li>上传结束后初选：彻底删除同步审核时排除的曲目</li>
          <li>
            二次筛选：根据各时段曲目要求筛选掉不符合基本要求和额外要求的曲目，移至回收站
          </li>
          <li>
            核查&复查：检查二次筛选有无遗漏的歌曲、回收站内歌曲是否确实不符合要求
          </li>
          <li>
            精选：每一时段留下10首左右（8-12首）精选曲目，作为大众投票的候选曲目
          </li>
        </ol>
        <hr />
        <h3>硬性规定：</h3>
        <ol>
          <li>
            曲目
            <strong>不得带有任何人声</strong>
          </li>
          <li>
            严禁恶搞类歌曲，包括但不仅限于不符合现代中学生审美的歌曲，如《北京的金山上》、《东方红》
          </li>
          <li>
            歌曲需能被大多数同学所接受，不符合此类要求的歌曲包括但不仅限于节奏过于劲爆的歌曲，过于刺耳的重金属音乐等等
          </li>
          <li>
            同一时段内不得出现重复的曲目，上传时仅对同一文件进行了限制，如为同一曲目的不同版本请斟酌后选出最适宜的一个版本，其余版本移至回收站
          </li>
        </ol>
        <hr />
        <h3>基本要求：</h3>
        <p>基本符合各时段音乐要求，如下：</p>
        <TimePeriodDescription />
        <hr />
        <h3>额外要求&提示：</h3>
        <ol>
          <li>
            为促进多样性和公平性，三年内的校园音乐原则上不应采用，往届校园音乐在非迫不得已的情况下也不建议采用
          </li>
          <li>
            鉴于广播的音质不佳，不建议曲目带有过多特效音（如流水声、雨声），播放时可能变为噪音
          </li>
          <li>同理，过于激烈的音乐可能导致破音，不建议采用</li>
          <li>同一时段内尽量不要出现过多同一来源的歌曲，尽量不超过3首</li>
          <li>应德育处要求，鼓励优秀的国产歌曲，保证国产歌曲占比在50%左右</li>
          <li>
            审核者删除的歌曲均被移入回收站，歌曲文件不会彻底删除，以免发生意外事故，核查&复查阶段由管理员从回收站彻底删除，开放投票期间回收站不会留有任何曲目
          </li>
          <li>
            审核的最终目的在于每一时段精选10首左右歌曲以节省投票所需时间，原则上审核结束后每一时段歌曲不超过10首，但如有本校学生原创歌曲不计入10首限制内
          </li>
          <li>
            审核时可善用标签功能对曲目进行标注以提高效率，如“人声”，“国产”，“原创”，“音质”（音质不佳），“音效”（指带有特殊音效），“过于激烈”，“时段”（时段不合适，待调整），“不合适”（不适合作为校园音乐），“纯钢琴”，“或5”（可以考虑移至第5时段），“曾用”（曾经被选为校园音乐）等等
          </li>
        </ol>
      </Typography>
    </>
  );
};

export default Home;
