import React from "react";
import moment from "moment";
import { connect } from "dva";
import { TimeSelector, VoteList } from "components";
import { Spin, Alert, Button, Result } from "antd";
import { ClockCircleTwoTone } from "@ant-design/icons";
import { PhaseCountdown, VotePreferencesModal } from "components";
import Title from "../hooks/useTitle";

const Vote = ({ vote, loading, dispatch }) => {
  const { time, status, songs } = vote;

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
              <VotePreferencesModal />
            </div>
            <VoteList songs={songs} time={time} />
          </div>
        )}
      </Spin>
    </>
  );
};

export default connect(({ vote, loading }) => ({ vote, loading }))(Vote);
