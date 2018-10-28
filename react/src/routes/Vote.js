import React from "react";
import { connect } from "dva";
import { TimeSelector, VoteList } from "components";
import { Button, Modal, Alert, Switch } from "antd";

class Vote extends React.Component {
  state = {
    modalVisible: false
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.voteList.getWrappedInstance().onRedirect();
    }
  }

  toggle = option => {
    const { dispatch } = this.props;
    dispatch({ type: "vote/toggle" + option });
  };

  handleRedirect = time => {
    const { dispatch } = this.props;
    this.voteList.getWrappedInstance().onRedirect();
    dispatch({ type: "vote/redirect", payload: time });
  };

  render() {
    const { vote } = this.props;
    const { time, skipVoted, skipAfterSubmitted, skipWhenEnded } = vote;

    return (
      <div>
        <Alert
          message="投票须知"
          type="info"
          description="试听总时长达到30秒即可提交投票，建议试听1分钟以上，详见首页投票说明"
          showIcon
          closable
          style={{ marginBottom: "10px" }}
        />
        <TimeSelector
          onChange={this.handleRedirect}
          style={{ width: "90px", marginBottom: "10px" }}
          value={time}
        />
        <div style={{ float: "right" }}>
          <Button
            icon="setting"
            type="secondary"
            onClick={() => this.setState({ modalVisible: true })}
          />
          <Modal
            title="偏好设置"
            centered
            visible={this.state.modalVisible}
            onCancel={() => this.setState({ modalVisible: false })}
            footer={null}
          >
            <p>
              自动跳过已投票曲目:{" "}
              <Switch
                checked={skipVoted}
                onChange={() => this.toggle("SkipVoted")}
              />
            </p>
            <p>
              手动提交后: 继续播放{" "}
              <Switch
                checked={skipAfterSubmitted}
                onChange={() => this.toggle("SkipAfterSubmitted")}
              />{" "}
              立即切换下一首
            </p>
            <p>
              播放结束但未投票时 : 暂停{" "}
              <Switch
                checked={skipWhenEnded}
                onChange={() => this.toggle("SkipWhenEnded")}
              />{" "}
              播放下一首
            </p>
          </Modal>
        </div>
        <VoteList ref={list => (this.voteList = list)} />
      </div>
    );
  }
}

export default connect(({ vote, loading }) => ({ vote, loading }))(Vote);
