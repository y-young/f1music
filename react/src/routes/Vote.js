import React, { useState } from "react";
import moment from "moment";
import { connect } from "dva";
import { TimeSelector, VoteList } from "components";
import { Form, Spin, Alert, Radio, Button, Modal, Switch, Result } from "antd";
import { ClockCircleTwoTone, SettingOutlined } from "@ant-design/icons";
import { PhaseCountdown } from "components";
import Title from "../hooks/useTitle";

const FormItem = Form.Item;

const Vote = ({ vote, loading, dispatch }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { time, skipVoted, onSubmitted, onEnded, status, songs } = vote;

  const toggle = option => {
    dispatch({ type: "vote/toggle" + option });
  };

  const save = (option, value) => {
    dispatch({ type: "vote/save" + option, payload: value });
  };

  const handleRedirect = time => {
    dispatch({ type: "vote/redirect", payload: time });
  };

  return (
    <>
      <Title>投票</Title>
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
              onChange={handleRedirect}
              style={{ width: "90px", marginBottom: "10px" }}
              value={time}
            />
            <div style={{ float: "right" }}>
              <Button type="secondary" onClick={() => setModalVisible(true)}>
                <SettingOutlined />
                偏好设置
              </Button>
              <Modal
                title="偏好设置"
                centered
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
              >
                <Form>
                  <FormItem label="自动跳过已投票曲目">
                    <Switch
                      checked={skipVoted}
                      onChange={() => toggle("SkipVoted")}
                    />
                  </FormItem>
                  <FormItem label="手动提交成功后">
                    <Radio.Group
                      defaultValue={onSubmitted}
                      onChange={e => save("OnSubmitted", e.target.value)}
                      buttonStyle="solid"
                    >
                      <Radio.Button value="continue">继续播放</Radio.Button>
                      <Radio.Button value="forward">切换下一首</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                  <FormItem label="播放结束但未投票时:">
                    <Radio.Group
                      defaultValue={onEnded}
                      onChange={e => save("OnEnded", e.target.value)}
                      buttonStyle="solid"
                    >
                      <Radio.Button value="pause">暂停</Radio.Button>
                      <Radio.Button value="forward">播放下一首</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                </Form>
              </Modal>
            </div>
            <VoteList songs={songs} time={time} />
          </div>
        )}
      </Spin>
    </>
  );
};

export default connect(({ vote, loading }) => ({ vote, loading }))(Vote);
