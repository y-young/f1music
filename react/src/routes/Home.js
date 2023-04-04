import { Spin, Tabs } from "antd";
import { StatusNotice } from "components";
import TimePeriodDescription from "components/TimePeriodDescription";
import UploadDescription from "components/UploadDescription";
import VoteDescription from "components/VoteDescription";
import { connect } from "dva";
import moment from "moment";
import React, { useEffect, useState } from "react";

const Home = ({ app, loading }) => {
  const { status } = app;
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    const currentTime = moment();
    const phase = (currentTime.isAfter(status.upload.end)
        && currentTime.isBefore(status.vote.end))
      ? "vote"
      : "upload";
    setActiveTab(phase);
  }, [status, setActiveTab]);

  return (
    <div>
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
        activeKey={activeTab}
        onChange={setActiveTab}
      />
    </div>
  );
};

export default connect(({ app, loading }) => ({ app, loading }))(Home);
