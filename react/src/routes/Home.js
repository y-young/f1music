import React from "react";
import moment from "moment";
import { connect } from "dva";
import { Alert, Row, Col, Spin, Tabs, Statistic } from "antd";
import {
  UploadOutlined,
  FormOutlined,
  ClockCircleOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import UploadDescription from "components/UploadDescription";
import VoteDescription from "components/VoteDescription";
import TimePeriodDescription from "components/TimePeriodDescription";
import { PhaseCountdown } from "components";

const Home = ({ app, loading }) => {
  const { status } = app;
  const StatusNotice = () => {
    let title = "正在进行",
      statusText = "...",
      countdownText = "结束",
      icon = <LoadingOutlined />,
      time = null;
    if (moment().isBetween(status.upload.start, status.upload.end)) {
      statusText = "上传";
      icon = <UploadOutlined />;
      time = status.upload.end;
    } else if (moment().isBetween(status.vote.start, status.vote.end)) {
      statusText = "投票";
      icon = <FormOutlined />;
      time = status.vote.end;
    } else if (moment().isBefore(status.upload.start)) {
      title = "即将开始";
      statusText = "上传";
      countdownText = "开始";
      icon = <ClockCircleOutlined />;
      time = status.upload.start;
    } else if (moment().isBefore(status.vote.start)) {
      title = "即将开始";
      statusText = "投票";
      countdownText = "开始";
      icon = <ClockCircleOutlined />;
      time = status.vote.start;
    }
    if (time != null) {
      return (
        <Alert
          type="info"
          closable
          description={
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title={title} value={statusText} prefix={icon} />
              </Col>
              <Col span={12}>
                <PhaseCountdown
                  title={"距离" + statusText + countdownText}
                  value={time}
                />
              </Col>
            </Row>
          }
        />
      );
    } else return "";
  };

  return (
    <div>
      <Spin spinning={loading.effects["app/fetchStatus"]}>
        {StatusNotice()}
      </Spin>
      <Tabs
        items={[
          { label: "上传说明", key: "upload", children: <UploadDescription /> },
          { label: "投票说明", key: "vote", children: <VoteDescription /> },
          {
            label: "各时段音乐要求",
            key: "requirements",
            children: <TimePeriodDescription />
          }
        ]}
      />
    </div>
  );
};

export default connect(({ app, loading }) => ({ app, loading }))(Home);
