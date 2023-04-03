import React from "react";
import moment from "moment";
import { TimeSelector, VoteProgress } from "components";
import { Alert, Button, Col, Result, Row, Spin } from "antd";
import { ClockCircleTwoTone } from "@ant-design/icons";
import { PhaseCountdown, VotePreferencesModal, VoteList } from "components";
import { useNavigate, useParams } from "react-router-dom";
import { useStatus } from "services/app";
import Title from "hooks/useTitle";
import { useVoteList } from "services/vote";

const Vote = () => {
  const { time } = useParams();

  const status = useStatus();
  const voteStatus = status.data?.vote ?? {};

  const { progress } = useVoteList(time);

  const navigate = useNavigate();
  const handleRedirect = (time) => {
    navigate(`/vote/${time}`);
  };

  return (
    <>
      <Title>投票</Title>
      <Spin spinning={status.isLoading}>
        {moment().isBefore(voteStatus.start) ? (
          <Result
            icon={<ClockCircleTwoTone />}
            title="抱歉，投票尚未开始，距离投票开始还有"
            subTitle={
              <PhaseCountdown
                value={voteStatus.start}
                tooltipPlacement="bottom"
              />
            }
            extra={
              <Button type="primary" href="#/">
                查看投票说明
              </Button>
            }
          />
        ) : moment().isAfter(voteStatus.end) ? (
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
                <Row gutter={16}>
                  <Col span={12}>
                    <PhaseCountdown
                      title="距离投票结束"
                      value={voteStatus.end}
                    />
                  </Col>
                  <Col span={12}>
                    <VoteProgress progress={progress} />
                  </Col>
                </Row>
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
            <VoteList time={time} />
          </div>
        )}
      </Spin>
    </>
  );
};

export default Vote;
