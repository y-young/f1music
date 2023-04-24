import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Spin, Tabs } from "antd";
import UploadDescription from "components/UploadDescription";
import VoteDescription from "components/VoteDescription";
import TimePeriodDescription from "components/TimePeriodDescription";
import { useStatus } from "services/app";

import Title from "../hooks/useTitle";

import { StatusNotice } from "components";

const Home = () => {
  const { data: status, isLoading } = useStatus();
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    const currentTime = dayjs();
    const phase =
      currentTime.isAfter(status?.upload.end) &&
      currentTime.isBefore(status?.vote.end)
        ? "vote"
        : "upload";
    setActiveTab(phase);
  }, [status, setActiveTab]);

  return (
    <>
      <Title>首页</Title>
      <Spin spinning={isLoading}>
        <StatusNotice status={status} />
      </Spin>
      <Tabs
        activeKey={activeTab}
        items={[
          { label: "上传说明", key: "upload", children: <UploadDescription /> },
          { label: "投票说明", key: "vote", children: <VoteDescription /> },
          {
            label: "各时段音乐要求",
            key: "requirements",
            children: (
              <>
                <p>
                  上传时请根据歌曲特征推荐播放时段，投票时请参考歌曲所在时段的音乐要求进行评价。
                </p>
                <TimePeriodDescription />
              </>
            ),
          },
        ]}
        onChange={setActiveTab}
      />
    </>
  );
};

export default Home;
