import React from "react";
import { connect } from "dva";
import { TimeSelector, VoteList } from "components";
import { Icon, Radio, Button, Modal, Alert, Switch } from "antd";

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

  save = (option, value) => {
    const { dispatch } = this.props;
    dispatch({ type: "vote/save" + option, payload: value });
  };

  handleRedirect = time => {
    const { dispatch } = this.props;
    this.voteList.getWrappedInstance().onRedirect();
    dispatch({ type: "vote/redirect", payload: time });
  };

  render() {
    const { vote } = this.props;
    const { time, skipVoted, onSubmitted, onEnded } = vote;

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
            type="secondary"
            onClick={() => this.setState({ modalVisible: true })}
          >
            <Icon type="setting" />
            偏好设置
          </Button>
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
              手动提交成功后:{" "}
              <Radio.Group
                defaultValue={onSubmitted}
                onChange={e => this.save("OnSubmitted", e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="continue">继续播放</Radio.Button>
                <Radio.Button value="forward">切换下一首</Radio.Button>
              </Radio.Group>
            </p>
            <p>
              播放结束但未投票时:{" "}
              <Radio.Group
                defaultValue={onEnded}
                onChange={e => this.save("OnEnded", e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="pause">暂停</Radio.Button>
                <Radio.Button value="forward">播放下一首</Radio.Button>
              </Radio.Group>
            </p>
          </Modal>
        </div>
        <VoteList ref={list => (this.voteList = list)} />
      </div>
    );
  }
}

export default connect(({ vote, loading }) => ({ vote, loading }))(Vote);
