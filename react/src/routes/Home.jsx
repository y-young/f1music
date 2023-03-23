import React, { useEffect, useState } from "react";
import moment from "moment";
import { connect } from "dva";
import { Spin, Tabs } from "antd";
import { StatusNotice } from "components";
import UploadDescription from "components/UploadDescription";
import VoteDescription from "components/VoteDescription";
import TimePeriodDescription from "components/TimePeriodDescription";
import Title from "../hooks/useTitle";

const Home = ({ app, loading }) => {
  const { status } = app;
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    const currentTime = moment();
    const phase =
      currentTime.isAfter(status.upload.end) &&
      currentTime.isBefore(status.vote.end)
        ? "vote"
        : "upload";
    setActiveTab(phase);
  }, [status, setActiveTab]);

  return (
    <>
      <Title>首页</Title>
      <Spin spinning={loading.effects["app/fetchStatus"]}>
        <StatusNotice status={status} />
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
        activeKey={activeTab}
        onChange={setActiveTab}
      />
    </>
  );
};

export default connect(({ app, loading }) => ({ app, loading }))(Home);
