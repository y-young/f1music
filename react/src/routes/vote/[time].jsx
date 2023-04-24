import dayjs from "dayjs";
import { Alert, Button, Col, Result, Row, Spin } from "antd";
import { ClockCircleTwoTone } from "@ant-design/icons";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useStatus } from "services/app";
import Title from "hooks/useTitle";
import { useVoteList } from "services/vote";
import { timeIdToName } from "utils/config";

import {
  PhaseCountdown,
  TimeSelector,
  VoteList,
  VotePreferencesModal,
  VoteProgress,
} from "components";

const Vote = () => {
  const { time } = useParams();
  const periodName = timeIdToName[time];
  if (!periodName) {
    return <Navigate to="/404" />;
  }

  // TODO
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const status = useStatus();
  const voteStatus = status.data?.vote ?? {};
  const currentTime = dayjs();

  // TODO
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { progress } = useVoteList(time);

  // TODO
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate();
  const handleRedirect = (time) => {
    navigate(`/vote/${time}`);
  };

  return (
    <>
      <Title>{`投票 - ${periodName}`}</Title>
      <Spin spinning={status.isLoading}>
        {currentTime.isBefore(voteStatus.start) ? (
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
              <Button type="primary" href="/">
                查看投票说明
              </Button>
            }
          />
        ) : currentTime.isAfter(voteStatus.end) ? (
          <Result
            status="error"
            title="抱歉，投票已结束"
            extra={
              <Button type="primary" href="/">
                返回首页
              </Button>
            }
          />
        ) : (
          <div>
            <Alert
              closable
              type="info"
              style={{ marginBottom: "10px" }}
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
            />
            <TimeSelector
              style={{ width: "90px", marginBottom: "10px" }}
              value={time}
              onChange={handleRedirect}
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
