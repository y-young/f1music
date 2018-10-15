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
    rate: 0,
    reason: "",
    nowIndex: "",
    lastIndex: "",
    canVote: false,
    canSubmit: false,
    showReport: false,
    triggerVote: true,
    countDown: 31,
    players: {}
  };

  init = () => {
    this.setState({
      rate: 0,
      reason: "",
      canVote: false,
      canSubmit: false,
      showReport: false,
      triggerVote: true
    });
  };
  stopLast = () => {
    if (this.state.lastIndex) {
      const player = this.refs["player" + this.state.lastIndex];
      player.stop();
      player.onProgress = undefined;
    }
  };
  onRedirect = () => {
    this.stopLast();
    this.setState({
      nowIndex: "",
      lastIndex: ""
    });
  };
  timeListener = (offset, song) => {
    const { dispatch } = this.props;
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
        this.handleVote(song);
      }
    }
  };
  handleChange = index => {
    const { vote } = this.props;
    const { auto, songs } = vote;
    this.stopLast();
    this.init();
    const player = this.refs["player" + index];
    if (index) {
      this.setState({ players[index].onProgress: offset => {
        this.timeListener(offset, songs[index]);
      }});
      console.log(player);
      this.audio.src = songs[index].url;
      if (songs[index].vote !== 0 || songs[index].listened) {
        this.setState({
          countDown: 0,
          rate: songs[index].vote,
          triggerVote: false
        });
      }
    } else {
      this.setState({ countDown: 31 });
    }
    this.setState({
      lastIndex: index,
      nowIndex: index
    });
    if (auto && index) {
      player.play();
    }
    return index;
  };
  playNext = () => {
    const { vote } = this.props;
    const { songs, auto } = vote;

    let newIndex = String(Number(this.state.nowIndex) + 1);
    if (songs[newIndex] && auto) {
      this.setState({ nowIndex: newIndex });
      this.handleChange(newIndex);
    }
  };
  checkValidity = () => {
    if (this.state.countDown > 0) {
      message.warning("试听时长需达到30秒才能投票");
      const player = this.refs["player" + this.state.nowIndex];
      player.audio.currentTime = 0;
      player.play();
      return false;
    }
    if (!this.state.canSubmit) {
      message.warning("选择或更改评价后才能提交");
      return false;
    }
    return true;
  };
  handleVote = (song, index = undefined) => {
    const { dispatch } = this.props;
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
        if (index !== undefined) {
          this.playNext();
        }
      }
    });
  };
  onEnded = (song, index) => {
    if (song.vote === 0) {
      if (this.checkValidity()) {
        this.handleVote(song, index);
      }
    } else {
      this.playNext();
    }
  };
  handleReport = id => {
    const { dispatch } = this.props;
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
    const listLoading = loading.effects["vote/fetch"];
    const list = songs.map((song, key) => {
      const buttonProps = {
        type: song.vote !== 0 ? "secondary" : "primary",
        shape: !isDesktop ? "circle" : undefined,
        icon: this.state.countDown <= 0 ? "check" : undefined,
        disabled: this.state.countDown > 0
      };
      return (
        <Panel
          header={"#" + (key + 1) + " 您的投票: " + voteTexts[song.vote]}
          key={key}
          forceRender={true}
        >
          <span>
            <div>
              <YPlayer
                audio={this.audio}
                onProgress={this.state.players[key].onProgress}
                onEnded={() => this.onEnded(song, key)}
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
                    placeholder="举报原因"
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
        <audio controls="controls" ref={audio => (this.audio = audio)} />
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
