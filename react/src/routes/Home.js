import React from "react";
import moment from "moment";
import { connect } from "dva";
import { Link } from "dva/router";
import { Alert, Row, Col, Spin, Tabs, Statistic } from "antd";
import {
  UploadOutlined,
  FormOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  LoadingOutlined
} from "@ant-design/icons";

const TabPane = Tabs.TabPane;
const { Countdown } = Statistic;

const Home = ({ app, loading }) => {
  const { status } = app;
  const StatusNotice = () => {
    let title = "正在进行",
      statusText = "...",
      countdownText = "结束",
      icon = <LoadingOutlined />,
      time = null;
    if (moment().isBetween(status.upload.start, status.upload.end)) {
      statusText = "上传";
      icon = <UploadOutlined />;
      time = status.upload.end;
    } else if (moment().isBetween(status.vote.start, status.vote.end)) {
      statusText = "投票";
      icon = <FormOutlined />;
      time = status.vote.end;
    } else if (moment().isBefore(status.upload.start)) {
      title = "即将开始";
      statusText = "上传";
      countdownText = "开始";
      icon = <ClockCircleOutlined />;
      time = status.upload.start;
    } else if (moment().isBefore(status.vote.start)) {
      title = "即将开始";
      statusText = "投票";
      countdownText = "开始";
      icon = <ClockCircleOutlined />;
      time = status.vote.start;
    }
    if (time != null) {
      return (
        <Alert
          type="info"
          closable
          description={
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title={title} value={statusText} prefix={icon} />
              </Col>
              <Col span={12}>
                <Countdown
                  title={"距离" + statusText + countdownText}
                  value={moment(time)}
                  format="D 天 H 时 m 分 s 秒"
                  onFinish={() => window.location.reload()}
                />
              </Col>
            </Row>
          }
        />
      );
    } else return "";
  };
  return (
    <div>
      <Spin spinning={loading.effects["app/fetchStatus"]}>
        {StatusNotice()}
      </Spin>
      <Tabs>
        <TabPane tab="上传说明" key="upload">
          <p>
            每位同学最多提交12首推荐曲目(歌曲数*时段数，如某一歌曲被推荐到两个时段计为两首曲目)。一首歌曲在一个时段只能被推荐一次，因此如果同一时段内已有同学推荐此歌曲，系统将予以提示，但仍可推荐到其他时段或提交另一版本。
          </p>

          <h3>硬性要求：</h3>
          <p>
            音频格式只能为
            mp3，并请保证有一定质量。歌曲时长控制在2.5-6分钟(特别地，
            <strong>午出门铃声时长须在5分钟以内</strong>
            )，音频文件大小介于2MB-15MB为宜，禁止上传大小超过20MB或小于1MB的文件。
          </p>
          <p>原则上一首歌曲(包括不同版本)在三年内只能当选一次</p>
          <p>
            此外，曲目
            <strong>不得带有任何人声</strong>
            。同时，请各位在挑选音乐的时候明确自己对全体师生的责任，在依据自身审美标准的同时考虑广大人民群众的需求，即歌曲须符合当代中学生审美并且能被大多数同学所接受。
          </p>

          <h3>额外建议：(增加过审概率)</h3>
          <ul>
            <li>
              鉴于广播的音质不佳，
              <strong>不建议</strong>
              曲目带有过多特效音(如流水声、雨声)，播放时可能变为噪音
            </li>
            <li>同理，过于激烈的音乐可能导致破音，不建议上传</li>
            <li>最重要的是想象实际播放情景进行判断</li>
          </ul>
          <hr />

          <h3>手动上传：</h3>
          <p>
            在提交新曲目时，需要参考各时段音乐要求选择一个推荐的播放时段，并填入曲名。“来源”一项表示此曲目的出处，可以填写该曲目来自的专辑、音乐家或节目、游戏等，
            <strong>不是表示上传者</strong>
            。如果不明来源可留空。手动上传时
            <strong>请先填写信息再上传文件</strong>。
          </p>

          <h3>网易云音乐上传(上传不消耗流量):</h3>
          <p>
            请在搜索框内输入要搜索的歌曲名称，按回车键或点击右侧搜索按钮进行搜索，选择曲目时请确保歌曲不带有非伴奏性人声，否则一经发现将直接删除。
          </p>
          <p>
            搜索结果加载完毕后请根据歌曲信息找到您要推荐的曲目，点击左侧“+”符号或点击表格行展开表单，“曲名”和“来源”两项可根据歌曲信息在下拉框中选择，其中“来源”一项将给出歌手名称和专辑名称两个选项，如您发现歌曲信息不准确亦可手动输入或进行修改。
          </p>
          <p>
            <strong>不支持上传无版权或付费歌曲</strong>
            ，上传时将予以提示，请手动上传或更换版本。
          </p>

          <hr />
          <p>
            出于公平性考虑，投票时将隐藏歌曲信息，因此将预先进行审核，对于严重恶搞、不符合要求、以及重复上传的内容，将直接删除。如果投票过程中发现上述情况，请点击播放器右下方的反馈按钮进行反馈，我们会尽快处理。此外，出于同样目的，上传时曲目的标签信息将被删除。但此操作耗时较多，因此上传进度到达100%后可能出现几秒的停顿，请耐心等待。
          </p>

          <p>
            <strong>应德育处要求，鼓励同学们上传优秀的国产歌曲。</strong>
          </p>
          <Link to="/upload" className="redirect">
            <ArrowRightOutlined /> 前往上传
          </Link>
        </TabPane>
        <TabPane tab="投票说明" key="vote">
          <p>
            为保证投票质量，目前禁止使用校园网默认密码(即123456)登录投票，使用默认密码的同学请先登录
            <a
              href="http://old.fzyz.net/"
              target="_blank"
              rel="noopener noreferrer"
            >
              福州一中官网
            </a>
            修改密码(官方推荐浏览器: Internet Explorer)。
          </p>

          <p>
            投票时请先选择一个时段，待页面加载完毕后从下方播放列表中点击一首歌曲试听，歌曲播放总时长达15秒后显示评分栏，总时长达30秒后允许提交投票，请综合您的感受及歌曲所在时段的音乐要求进行评价，选择“1星
            - 非常不合适”、“2星 - 不合适”、“3星 - 中立”、“4星 - 合适”或“5星 -
            非常合适”，然后点击提交按钮进行提交。
          </p>
          <p>
            虽然倒计时30秒结束后就允许提交投票，但仍然
            <strong>建议同学们至少试听1分钟后再提交投票</strong>
            ，以免误判。
          </p>

          <p>
            <font style={{ color: "red" }}>NEW </font>
            播放器现已支持显示缓冲进度(部分浏览器不兼容)
            ，如试听过程中出现卡顿或暂停可能为歌曲正在缓冲，请耐心等待，多次出现此问题请检查网络状况，遭遇错误请先刷新重试。
          </p>
          <p>
            <font style={{ color: "red" }}>NEW </font>
            播放器现已支持调整播放进度，总试听时长达到30秒(倒计时结束)即可，同时倒计时完毕后如果已经进行评分将自动提交投票(仅限未投票且未试听过的曲目)。
          </p>
          <p>提交投票后仍可对评价进行更改并再次提交。</p>
          <p>
            <font style={{ color: "red" }}>NEW </font>
            <strong>
              已投票或已试听过但还未投票(刷新页面无效)的曲目再次试听时无需等待倒计时。
            </strong>
          </p>
          <p>若已对歌曲进行打分但未提交，播放完毕后将会自动提交。</p>

          <h3>自定义选项(部分选项可在投票页偏好设置进行修改):</h3>

          <ul>
            <li>
              自动跳过已投票歌曲，仅当使用上一首/下一首按钮或自动切换时有效，播放列表手动切换时无效，默认启用
            </li>
            <li>手动提交投票后切换下一首或继续播放，默认继续播放</li>
            <li>
              歌曲播放结束但还未提交投票时暂停或仍然切换到下一首，默认暂停
            </li>
            <li>
              播放完毕且已经投票后自动切换到下一首，并开始播放(不跨时段,部分浏览器不兼容)
            </li>
          </ul>

          <p>
            部分浏览器不支持此功能，如您在使用时发生错误，请更换主流浏览器。
          </p>
          <hr />
          <p>
            为保证公平性，投票时的曲目列表经过随机排列，但每个同学的曲目顺序固定不变。投票时
            <strong>
              请勿依据过于强烈的主观感受进行评价，禁止恶意投票、拉票等违规行为
            </strong>
            ，一经发现将采取相应措施。
          </p>
          <Link to="/vote/1" className="redirect">
            <ArrowRightOutlined /> 前往投票
          </Link>
        </TabPane>
        <TabPane tab="各时段音乐要求" key="requirements">
          <p>
            上传时请根据歌曲特征推荐播放时段，投票时请参考歌曲所在时段的音乐要求进行评价。
          </p>

          <ul>
            <li>6:40 起床铃：能使人逐渐清醒，最重要的是最好不要有催眠效果。</li>
            <li>7:10 早出门：较为激烈，要能使同学们清醒。</li>
            <li>
              13:45
              午出门：能提醒午睡的同学及时起床，同时不给在班上的同学带来太大噪音。
            </li>
            <li>18:10 晚出门：暂无额外要求。</li>
            <li>21:35 晚自习结束：暂无额外要求。</li>
            <li>
              22:30
              熄灯铃：能让想睡的同学入睡，让想夜读的同学能继续夜读，歌曲时长不宜过长。
            </li>
          </ul>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ app, loading }) => ({ app, loading }))(Home);
