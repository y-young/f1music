import React from "react";
import { connect } from "dva";
import { Collapse, Spin, Input, Rate, Button, message } from "antd";
import { CSSTransitionGroup } from "react-transition-group";
import styles from "./VoteList.css";
import YPlayer from "./YPlayer";
import { config } from "utils";

const Panel = Collapse.Panel;
const { voteTexts } = config;

class VoteList extends React.Component {
  state = {
    currentTime: 0,
    rate: 0,
    reason: "",
    nowIndex: "",
    lastIndex: "",
    canVote: false,
    canSubmit: false,
    showReport: false,
    countDown: 31
  };

  init = () => {
    this.setState({
      currentTime: 0,
      rate: 0,
      reason: "",
      canVote: false,
      canSubmit: false,
      showReport: false,
    });
  };
  onRedirect = () => {
    if (this.state.lastIndex) {
      this.refs["player" + this.state.lastIndex].stop();
    }
    this.setState({
      nowIndex: "",
      lastIndex: ""
    });
  };
  timeListener = offset => {
    /*if (!this.state.canVote && time >= 30) {
      this.setState({ canVote: true });
    }*/
    if (this.state.countDown > 0) {
      this.setState(prevState => {
        return { countDown: prevState.countDown - offset };
      });
    }
  };
  triggerNext = nowIndex => {
    const { vote } = this.props;
    const { auto, songs } = vote;
    let newIndex = String(Number(nowIndex) + 1);
    // Try to solve the problem of 'play() can only be initiated by a user gesture by playing and immediately stoping it
    if (songs[newIndex] && auto) {
      this.refs["player" + newIndex].audio.play();
      this.refs["player" + newIndex].audio.pause();
    }
  };
  handleChange = index => {
    const { vote } = this.props;
    const { auto, songs } = vote;
    if (this.state.lastIndex) {
      this.refs["player" + this.state.lastIndex].stop();
    }
    this.init();
    if (index && songs[index].vote !== 0) {
      this.setState({ countDown: 0, rate: songs[index].vote });
    } else {
      this.setState({ countDown: 31 });
    }
    this.setState({
      lastIndex: index,
      nowIndex: index
    });
    this.triggerNext(index);
    const player = this.refs["player" + index];
    if (auto && index) {
      //this.init();
      player.play();
      //player.audio.currentTime = 120;
    }
    return index;
  };
  handleVote = (song, index) => {
    const { vote, dispatch } = this.props;
    const { songs, auto } = vote;
    if (this.state.countDown > 0) {
      message.warning("试听时长需达到30秒才能投票");
      const player = this.refs["player" + index];
      player.audio.currentTime = 0;
      player.play();
      return;
    }
    if (!this.state.canSubmit) {
      message.error("选择或更改评价后才能提交");
      return;
    }
    let newIndex = String(Number(this.state.nowIndex) + 1);
    //this.triggerNext(this.state.nowIndex);
    const id = song.id;
    const rate = this.state.rate;
    dispatch({ type: "vote/vote", payload: { id, rate } }).then(success => {
      if (success) {
        message.success("投票成功!");
        this.setState({ canSubmit: false });
        if (songs[newIndex] && auto) {
          this.setState({ nowIndex: newIndex });
          this.handleChange(newIndex);
        }
      }
    });
  };
  handleReport = id => {
    const { dispatch } = this.props;
    dispatch({
      type: "vote/report",
      payload: { id: id, reason: this.state.reason }
    });
  };

  render() {
    const { vote, loading } = this.props;
    const { isDesktop, songs } = vote;
    const listLoading = loading.effects["vote/fetch"];
    const buttonProps = {
      shape: !isDesktop ? "circle" : undefined,
      icon: this.state.countDown <= 0 ? "check" : undefined,
      disabled: this.state.countDown > 0
    };
    const list = songs.map((song, key) => {
      return (
        <Panel
          header={"#" + (key + 1) + " 您的投票: " + voteTexts[song.vote]}
          key={key}
          forceRender={true}
        >
          <span>
            <div>
              <YPlayer
                src={song.url}
                onProgress={this.timeListener}
                onEnded={() => this.handleVote(song, key)}
                ref={"player" + key}
                className={styles.yplayer}
              />
              <br />
              <Button
                size="small"
                onClick={() =>
                  this.setState({ showReport: !this.state.showReport })
                }
                className={styles.toggleReport}
              >
                举报
              </Button>
            </div>
            <br />
            <div className={styles.voteArea} key="vote">
              <hr />
              <Rate
                value={this.state.rate}
                onChange={value =>
                  this.setState({ rate: value, canSubmit: true })
                }
                className={styles.rate}
              />
              {this.state.rate !== 0 && (
                <div className={styles.voteText}>
                  <span className="ant-rate-text">
                    {voteTexts[this.state.rate]}
                  </span>
                </div>
              )}
              <Button
                type="primary"
                loading={loading.effects["vote/vote"]}
                className={styles.voteButton}
                onClick={() => this.handleVote(song)}
                {...buttonProps}
              >
                {this.state.countDown > 0
                  ? Math.floor(this.state.countDown)
                  : isDesktop && "投票"}
              </Button>
            </div>
            <CSSTransitionGroup
              transitionName="fade"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={200}
            >
              {this.state.showReport && (
                <div className={styles.reportArea} key="report">
                  <Input
                    value={this.state.reason}
                    placeholder="填写举报原因"
                    className={styles.reason}
                    onChange={e => this.setState({ reason: e.target.value })}
                    maxLength="60"
                  />
                  <Button
                    type="primary"
                    onClick={() => this.handleReport(song.id)}
                    loading={loading.effects["vote/report"]}
                    className={styles.reportButton}
                  >
                    提交
                  </Button>
                </div>
              )}
            </CSSTransitionGroup>
          </span>
        </Panel>
      );
    });
    return (
      <Spin spinning={listLoading}>
        <Collapse
          accordion
          bordered={false}
          onChange={this.handleChange}
          activeKey={this.state.nowIndex}
          ref={list => (this.list = list)}
        >
          {list}
        </Collapse>
      </Spin>
    );
  }
}

export default connect(
  ({ vote, loading }) => ({ vote, loading }),
  null,
  null,
  { withRef: true }
)(VoteList);
