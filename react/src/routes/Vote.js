import React from "react";
import moment from "moment";
import { connect } from "dva";
import { TimeSelector, VoteList } from "components";
import { Form, Spin, Alert, Radio, Button, Modal, Switch, Result } from "antd";
import { ClockCircleTwoTone, SettingOutlined } from "@ant-design/icons";
import { PhaseCountdown } from "components";

const FormItem = Form.Item;

class Vote extends React.Component {
  state = {
    modalVisible: false
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.location.pathname !== prevProps.location.pathname &&
      this.voteList
    ) {
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
    const { vote, loading } = this.props;
    const { time, skipVoted, onSubmitted, onEnded, status } = vote;

    return (
      <Spin spinning={loading.effects["vote/fetchStatus"]}>
        {moment().isBefore(status.start) ? (
          <Result
            icon={<ClockCircleTwoTone />}
            title="抱歉，投票尚未开始，距离投票开始还有"
            subTitle={
              <PhaseCountdown value={status.start} tooltipPlacement="bottom" />
            }
            extra={
              <Button type="primary" href="#/">
                查看投票说明
              </Button>
            }
          />
        ) : moment().isAfter(status.end) ? (
          <Result
            status="error"
            title="抱歉，投票已结束"
            extra={
              <Button type="primary" href="#/">
                返回首页
              </Button>
            }
          />
        ) : (
          <div>
            <Alert
              type="info"
              closable
              description={
                <PhaseCountdown title="距离投票结束" value={status.end} />
              }
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
                <SettingOutlined />
                偏好设置
              </Button>
              <Modal
                title="偏好设置"
                centered
                open={this.state.modalVisible}
                onCancel={() => this.setState({ modalVisible: false })}
                footer={null}
              >
                <Form>
                  <FormItem label="自动跳过已投票曲目">
                    <Switch
                      checked={skipVoted}
                      onChange={() => this.toggle("SkipVoted")}
                    />
                  </FormItem>
                  <FormItem label="手动提交成功后">
                    <Radio.Group
                      defaultValue={onSubmitted}
                      onChange={e => this.save("OnSubmitted", e.target.value)}
                      buttonStyle="solid"
                    >
                      <Radio.Button value="continue">继续播放</Radio.Button>
                      <Radio.Button value="forward">切换下一首</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                  <FormItem label="播放结束但未投票时:">
                    <Radio.Group
                      defaultValue={onEnded}
                      onChange={e => this.save("OnEnded", e.target.value)}
                      buttonStyle="solid"
                    >
                      <Radio.Button value="pause">暂停</Radio.Button>
                      <Radio.Button value="forward">播放下一首</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                </Form>
              </Modal>
            </div>
            <VoteList ref={list => (this.voteList = list)} />
          </div>
        )}
      </Spin>
    );
  }
}

export default connect(({ vote, loading }) => ({ vote, loading }))(Vote);
