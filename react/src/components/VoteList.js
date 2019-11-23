import React from "react";
import { connect } from "dva";
import { Link } from "dva/router";
import { Icon, Spin, Input, Rate, Button, message } from "antd";
import { CSSTransitionGroup } from "react-transition-group";
import styles from "./VoteList.css";
import YPlayer from "./YPlayer";
import { config } from "utils";

const { voteTexts } = config;

class VoteList extends React.Component {
  state = {
    rate: 0,
    src: "",
    reason: "",
    index: "",
    canVote: false,
    canSubmit: false,
    showReport: false,
    triggerVote: true,
    countdown: 30,
    canBackward: false,
    canForward: false
  };

  init = () => {
    this.setState({
      rate: 0,
      countdown: 30,
      reason: "",
      canVote: false,
      canSubmit: false,
      showReport: false,
      triggerVote: true,
      canBackward: false,
      canForward: false
    });
  };
  stopLast = () => {
    if (this.player) {
      this.player.stop();
    }
  };
  onRedirect = () => {
    this.stopLast();
    this.setState({ index: "", src: "" });
    this.init();
  };
  timeListener = offset => {
    const { dispatch, vote } = this.props;
    const { songs } = vote;
    const song = songs[this.state.index];
    if (this.state.countdown > 0) {
      this.setState(prevState => {
        return { countdown: prevState.countdown - offset };
      });
    } else {
      if (!song.listened && song.vote === 0) {
        dispatch({ type: "vote/markListened", payload: song.id });
      }
      //triggerVote: Only when first listen
      if (this.state.triggerVote) {
        this.setState({ triggerVote: false });
        this.handleVote();
      }
    }
  };
  handleSwitch = index => {
    const { vote } = this.props;
    const { songs } = vote;
    const player = this.player;
    if (index !== this.state.index) {
      this.setState({ index: index }, () => {
        this.updateButtonStatus();
      });
      this.stopLast();
      this.init();
      this.setState({ src: songs[index].url }, () => {
        player.play();
      });
      if (songs[index].vote !== 0 || songs[index].listened) {
        this.setState({
          countdown: 0,
          rate: songs[index].vote,
          triggerVote: false
        });
      } else {
        this.setState({ countdown: 30 });
      }
    } else {
      player.toggle();
    }
    return index;
  };
  updateButtonStatus = () => {
    const { vote } = this.props;
    const { songs } = vote;
    const previous = Number(this.state.index) - 1;
    const next = Number(this.state.index) + 1;
    this.setState({
      canBackward: songs[previous] !== undefined,
      canForward: songs[next] !== undefined
    });
  };
  forward = () => {
    const { vote } = this.props;
    const { songs, skipVoted } = vote;
    let newIndex = Number(this.state.index) + 1;
    if (skipVoted) {
      while (songs[newIndex] && songs[newIndex].vote !== 0) {
        newIndex++;
      }
    }
    if (songs[newIndex]) {
      this.handleSwitch(newIndex);
    } else if (skipVoted) {
      message.info("您已选择跳过已投票歌曲，如无需要请修改偏好设置");
    }
  };
  backward = () => {
    const { vote } = this.props;
    const { songs, skipVoted } = vote;
    let newIndex = Number(this.state.index) - 1;
    if (skipVoted) {
      while (songs[newIndex] && songs[newIndex].vote !== 0) {
        newIndex--;
      }
    }
    if (songs[newIndex]) {
      this.handleSwitch(newIndex);
    } else if (skipVoted) {
      message.info("您已选择跳过已投票歌曲，如无需要请修改偏好设置");
    }
  };
  checkValidity = () => {
    if (this.state.countdown > 0) {
      message.warning("试听时长需达到30秒才能投票");
      const player = this.player;
      player.audio.currentTime = 0;
      player.play();
      return "time";
    }
    if (!this.state.canSubmit || this.state.rate === 0) {
      message.info("选择或更改评价后即可提交");
      return "rate";
    }
    return "valid";
  };
  handleVote = (type = null) => {
    const { dispatch, vote } = this.props;
    const { songs, onSubmitted } = vote;
    const song = songs[this.state.index];
    const validity = this.checkValidity();
    if (validity !== "valid") {
      return;
    }
    const id = song.id;
    const rate = this.state.rate;
    dispatch({ type: "vote/vote", payload: { id, rate } }).then(success => {
      if (success) {
        message.success("投票成功");
        this.setState({ canSubmit: false });
        if (
          (type === "manual" && onSubmitted === "forward") ||
          type === "ended"
        ) {
          this.forward();
        }
      }
    });
  };
  onEnded = () => {
    const { vote } = this.props;
    const { songs, onEnded } = vote;
    const song = songs[this.state.index];
    const validity = this.checkValidity();
    if (song.vote === 0) {
      if (validity === "valid") {
        this.handleVote("ended");
      } else if (validity === "rate" && onEnded === "forward") {
        this.forward();
      }
    } else {
      this.forward();
    }
  };
  handleReport = () => {
    const { dispatch, vote } = this.props;
    const { songs } = vote;
    const id = songs[this.state.index].id;
    dispatch({
      type: "vote/report",
      payload: { id: id, reason: this.state.reason }
    }).then(success => {
      if (success) {
        this.setState({ showReport: false });
      }
    });
  };
  render() {
    const { vote, loading } = this.props;
    const { time, isDesktop, songs } = vote;
    const song = songs[this.state.index]
      ? songs[this.state.index]
      : { vote: 0 };
    const buttonProps = {
      type: song.vote !== 0 ? "secondary" : "primary",
      shape: !isDesktop ? "circle" : undefined,
      icon: this.state.countdown <= 0 ? "check" : undefined,
      disabled: this.state.countdown > 0
    };
    const voteArea = (
      <div className={styles.voteArea} key="vote">
        <hr />
        {this.state.countdown <= 15 ? (
          <div>
            <Rate
              value={this.state.rate}
              onChange={value =>
                this.setState({ rate: value, canSubmit: true })
              }
              allowClear={false}
              className={styles.rate}
            />
            {this.state.rate !== 0 && (
              <div className={styles.voteText}>
                <span className="ant-rate-text">
                  {voteTexts[this.state.rate]}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.voteText}>
            <span className="ant-rate-text" style={{ color: "#777" }}>
              试听15秒后显示评分栏
            </span>
          </div>
        )}
        <Button
          loading={loading.effects["vote/vote"]}
          className={styles.voteButton}
          onClick={() => this.handleVote("manual")}
          {...buttonProps}
        >
          {this.state.countdown > 0
            ? Math.ceil(this.state.countdown)
            : isDesktop && "投票"}
        </Button>
      </div>
    );
    const reportArea = (
      <div className={styles.reportArea} key="report">
        <Input
          value={this.state.reason}
          placeholder="反馈内容"
          className={styles.reason}
          onChange={e => this.setState({ reason: e.target.value })}
          maxLength={60}
          onPressEnter={this.handleReport}
        />
        <Button
          type="primary"
          onClick={this.handleReport}
          loading={loading.effects["vote/report"]}
          className={styles.reportButton}
        >
          提交
        </Button>
      </div>
    );
    const list = songs.map((song, key) => {
      const current = key === this.state.index;
      return (
        <li
          style={current ? { color: "#1890ff" } : {}}
          className={styles.listItem}
          onClick={() => this.handleSwitch(key)}
          key={key}
        >
          <span className={styles.itemIndex}>{key + 1}</span>
          {"您的评价: " + voteTexts[song.vote]}
        </li>
      );
    });
    const notice = () => {
      let voted = 0;
      songs.forEach(song => {
        if (song.vote !== 0) {
          voted++;
        }
      });
      if (voted === songs.length) {
        let rndTime;
        do {
          rndTime = Math.floor(Math.random() * 5 + 1);
        } while (rndTime === time);
        return (
          <div className="tips">
            <Icon type="bulb" /> 您已投完本时段所有曲目，到
            <Link to={"/vote/" + rndTime}>其他时段</Link>
            看看吧
          </div>
        );
      } else {
        return (
          <div className="tips">
            <Icon type="bulb" /> 本时段您已投 {voted} 首曲目，还有{" "}
            {songs.length - voted} 首未投票曲目
          </div>
        );
      }
    };

    return (
      <Spin spinning={loading.effects["vote/fetchList"]}>
        {songs.length !== 0 ? (
          <span>
            <div>
              <YPlayer
                src={this.state.src}
                onProgress={this.timeListener}
                onEnded={this.onEnded}
                canBackward={this.state.canBackward}
                canForward={this.state.canForward}
                onBackward={this.backward}
                onForward={this.forward}
                ref={player => (this.player = player)}
                className={styles.yplayer}
              />
              <br />
              <Button
                size="small"
                onClick={() =>
                  this.setState({ showReport: !this.state.showReport })
                }
                disabled={this.state.index === ""}
                className={styles.toggleReport}
              >
                反馈
              </Button>
            </div>
            <br />
            {voteArea}
            <CSSTransitionGroup
              transitionName="fade"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={200}
            >
              {this.state.showReport && reportArea}
            </CSSTransitionGroup>
            <ol className={styles.list}>{list}</ol>
            {notice()}
          </span>
        ) : (
          <div className="tips">投票未开放或暂无数据</div>
        )}
      </Spin>
    );
  }
}

export default connect(({ vote, loading }) => ({ vote, loading }), null, null, {
  withRef: true
})(VoteList);
