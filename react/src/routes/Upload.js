import React from "react";
import moment from "moment";
import { connect } from "dva";
import { Alert, Row, Col, Button, Tabs, Spin, Statistic, Result } from "antd";
import { SmileTwoTone, ClockCircleTwoTone } from "@ant-design/icons";
import { CloudUpload, ManualUpload, ViewUploads } from "components";

const TabPane = Tabs.TabPane;
const { Countdown } = Statistic;

const Upload = ({ upload, loading }) => {
  const { songs, status } = upload;
  const uploaded = songs.length;
  const AllDone = (
    <Result
      icon={<SmileTwoTone />}
      title="上传曲目数已达到限额，感谢您对校园音乐活动的支持"
      subTitle="请耐心等待投票开放"
    />
  );

  return (
    <Spin
      spinning={
        loading.effects["upload/fetchUploads"] ||
        loading.effects["upload/fetchStatus"]
      }
    >
      {moment().isBefore(status.start) ? (
        <Result
          icon={<ClockCircleTwoTone />}
          title="抱歉，上传尚未开始，距离上传开始还有"
          subTitle={
            <Countdown
              value={moment(status.start)}
              format="D 天 H 时 m 分 s 秒"
              onFinish={() => window.location.reload()}
            />
          }
          extra={
            <Button type="primary" href="#/">
              查看上传说明
            </Button>
          }
        />
      ) : moment().isAfter(status.end) ? (
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
                  <Countdown
                    title={"距离上传结束"}
                    value={moment(status.end)}
                    format="D 天 H 时 m 分 s 秒"
                    onFinish={() => window.location.reload()}
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
          <Tabs defaultActiveKey="netease">
            <TabPane tab="网易云音乐" key="netease">
              {uploaded < 12 ? <CloudUpload /> : AllDone}
            </TabPane>
            <TabPane tab="手动上传" key="manual">
              {uploaded < 12 ? <ManualUpload /> : AllDone}
            </TabPane>
            <TabPane tab="我的推荐" key="uploads">
              <ViewUploads />
            </TabPane>
          </Tabs>
        </div>
      )}
    </Spin>
  );
};

export default connect(({ upload, loading }) => ({ upload, loading }))(Upload);
