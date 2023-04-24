import dayjs from "dayjs";
import { Alert, Col, Row, Statistic } from "antd";
import {
  ClockCircleOutlined,
  FormOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import isBetween from "dayjs/plugin/isBetween";

import { PhaseCountdown } from "components";

dayjs.extend(isBetween);

const StatusNotice = ({ status }) => {
  if (!status) {
    return null;
  }

  const currentTime = dayjs();
  let title = "正在进行";
  let statusText = "...";
  let countdownText = "结束";
  let icon = <LoadingOutlined />;
  let time = null;

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
      closable
      type="info"
      description={
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title={title} value={statusText} prefix={icon} />
          </Col>
          <Col span={12}>
            <PhaseCountdown
              title={`距离${statusText}${countdownText}`}
              value={time}
            />
          </Col>
        </Row>
      }
    />
  );
};

export default StatusNotice;
