import React from "react";
import moment from "moment";
import { Alert, Row, Col, Statistic } from "antd";
import {
  UploadOutlined,
  FormOutlined,
  ClockCircleOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { PhaseCountdown } from "components";

const StatusNotice = ({ status }) => {
  const currentTime = moment();
  let title = "正在进行",
    statusText = "...",
    countdownText = "结束",
    icon = <LoadingOutlined />,
    time = null;

  if (currentTime.isBetween(status.upload.start, status.upload.end)) {
    statusText = "上传";
    icon = <UploadOutlined />;
    time = status.upload.end;
  } else if (currentTime.isBetween(status.vote.start, status.vote.end)) {
    statusText = "投票";
    icon = <FormOutlined />;
    time = status.vote.end;
  } else if (currentTime.isBefore(status.upload.start)) {
    title = "即将开始";
    statusText = "上传";
    countdownText = "开始";
    icon = <ClockCircleOutlined />;
    time = status.upload.start;
  } else if (currentTime.isBefore(status.vote.start)) {
    title = "即将开始";
    statusText = "投票";
    countdownText = "开始";
    icon = <ClockCircleOutlined />;
    time = status.vote.start;
  }

  if (!time) {
    return null;
  }

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
};

export default StatusNotice;
