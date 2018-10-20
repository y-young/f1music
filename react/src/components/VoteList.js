import React from "react";
import { connect } from "dva";
import { Spin, Input, Rate, Button, message } from "antd";
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
    countDown: 31
  };

  init = () => {
    this.setState({
      rate: 0,
      countDown: 31,
      reason: "",
      canVote: false,
      canSubmit: false,
      showReport: false,
      triggerVote: true
    });
  };
  stopLast = () => {
    this.player.stop();
    this.setState({ src: "" });
  };
  onRedirect = () => {
    this.stopLast();
    this.setState({ index: "" });
    this.init();
  };
  timeListener = offset => {
    const { dispatch, vote } = this.props;
    const { songs } = vote;
    const song = songs[this.state.index];
    if (this.state.countDown > 0) {
      this.setState(prevState => {
        return { countDown: prevState.countDown - offset };
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
  handleChange = index => {
    const { vote } = this.props;
    const { auto, songs } = vote;
    const player = this.player;
    if (index !== this.state.index) {
      this.stopLast();
      this.init();
      this.setState({ src: songs[index].url }, () => {
        if (auto) {
          player.play();
        }
      });
      if (songs[index].vote !== 0 || songs[index].listened) {
        this.setState({
          countDown: 0,
          rate: songs[index].vote,
          triggerVote: false
        });
      } else {
        this.setState({ countDown: 31 });
      }
    } else {
      player.toggle();
    }
    this.setState({
      index: index
    });
    return index;
  };
  playNext = () => {
    const { vote } = this.props;
    const { songs, auto } = vote;

    let newIndex = String(Number(this.state.index) + 1);
    if (songs[newIndex] && auto) {
      //      this.setState({ index: newIndex });
      this.handleChange(newIndex);
    }
  };
  checkValidity = () => {
    if (this.state.countDown > 0) {
      message.warning("试听时长需达到30秒才能投票");
      const player = this.player;
      player.audio.currentTime = 0;
      player.play();
      return false;
    }
    if (!this.state.canSubmit) {
      message.info("选择或更改评价后即可提交");
      return false;
    }
    return true;
  };
  handleVote = ended => {
    const { dispatch, vote } = this.props;
    const { songs } = vote;
    const song = songs[this.state.index];
    const validity = this.checkValidity();
    if (!validity) {
      return;
    }
    const id = song.id;
    const rate = this.state.rate;
    dispatch({ type: "vote/vote", payload: { id, rate } }).then(success => {
      if (success) {
        message.success("投票成功");
        this.setState({ canSubmit: false });
        if (ended) {
          this.playNext();
        }
      }
    });
  };
  onEnded = () => {
    const { vote } = this.props;
    const { songs } = vote;
    const song = songs[this.state.index];
    if (song.vote === 0) {
      if (this.checkValidity()) {
        this.handleVote(true);
      }
    } else {
      this.playNext();
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
    const { isDesktop, songs } = vote;
    const song = songs[this.state.index]
      ? songs[this.state.index]
      : { vote: 0 };
    const listLoading = loading.effects["vote/fetch"];
    const list = songs.map((song, key) => {
      const current = key === this.state.index;
      return (
        <li
          style={current ? { color: "#1890ff" } : {}}
          className={styles.listItem}
          onClick={() => this.handleChange(key)}
          key={key}
        >
          <span className={styles.itemIndex}>{key + 1}</span>
          {"您的投票: " + voteTexts[song.vote]}
        </li>
      );
    });
    const buttonProps = {
      type: song.vote !== 0 ? "secondary" : "primary",
      shape: !isDesktop ? "circle" : undefined,
      icon: this.state.countDown <= 0 ? "check" : undefined,
      disabled: this.state.countDown > 0
    };
    return (
      <Spin spinning={listLoading}>
        <span>
          <div>
            <YPlayer
              src={this.state.src}
              onProgress={this.timeListener}
              onEnded={this.onEnded}
              ref={player => (this.player = player)}
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
              loading={loading.effects["vote/vote"]}
              className={styles.voteButton}
              onClick={this.handleVote}
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
                  placeholder="举报原因"
                  className={styles.reason}
                  onChange={e => this.setState({ reason: e.target.value })}
                  maxLength="60"
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
            )}
          </CSSTransitionGroup>
        </span>
        <ol className={styles.list}>{list}</ol>
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
