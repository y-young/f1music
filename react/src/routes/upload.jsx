import React from "react";
import dayjs from "dayjs";
import { Alert, Row, Col, Button, Tabs, Spin, Statistic, Result } from "antd";
import { SmileTwoTone, ClockCircleTwoTone } from "@ant-design/icons";
import {
  CloudUpload,
  ManualUpload,
  ViewUploads,
  PhaseCountdown
} from "components";
import { useStatus } from "services/app";
import Title from "../hooks/useTitle";
import { useMyUploads } from "services/upload";

const Upload = () => {
  const status = useStatus();
  const uploadStatus = status.data?.upload ?? {};
  const currentTime = dayjs();

  const myUploads = useMyUploads();
  const uploaded = myUploads.data?.length ?? 0;
  const AllDone = (
    <Result
      icon={<SmileTwoTone />}
      title="上传曲目数已达到限额，感谢您对校园音乐活动的支持"
      subTitle="请耐心等待投票开放"
    />
  );

  return (
    <>
      <Title>上传</Title>
      <Spin spinning={myUploads.isLoading || status.isLoading}>
        {currentTime.isBefore(uploadStatus.start) ? (
          <Result
            icon={<ClockCircleTwoTone />}
            title="抱歉，上传尚未开始，距离上传开始还有"
            subTitle={
              <PhaseCountdown
                value={uploadStatus.start}
                tooltipPlacement="bottom"
              />
            }
            extra={
              <Button type="primary" href="#/">
                查看上传说明
              </Button>
            }
          />
        ) : currentTime.isAfter(uploadStatus.end) ? (
          <Result
            status="error"
            title="抱歉，上传已结束"
            extra={
              <Button type="primary" href="#/vote/1">
                前往投票
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
                      title="距离上传结束"
                      value={uploadStatus.end}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="已上传曲目数"
                      value={uploaded}
                      suffix="/ 12"
                    />
                  </Col>
                </Row>
              }
            />
            <Tabs
              defaultActiveKey="netease"
              items={[
                {
                  key: "netease",
                  label: "网易云音乐",
                  children: uploaded < 12 ? <CloudUpload /> : AllDone
                },
                {
                  key: "manual",
                  label: "手动上传",
                  children: uploaded < 12 ? <ManualUpload /> : AllDone
                },
                { key: "uploads", label: "我的推荐", children: <ViewUploads /> }
              ]}
            />
          </div>
        )}
      </Spin>
    </>
  );
};

export default Upload;
