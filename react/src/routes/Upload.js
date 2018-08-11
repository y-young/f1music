import React from "react";
import { connect } from "dva";
import { Alert, Tabs, Spin } from "antd";
import { CloudUpload, ManualUpload, ViewUploads } from "components";

const TabPane = Tabs.TabPane;

const Upload = ({ upload, loading }) => {
  const { songs } = upload;
  const uploaded = songs.length;
  const remaining = 10 - uploaded;
  const RemainingNotice = () => {
    if (uploaded === 10) {
      return "您所上传的曲目已经达到最大限制10首,感谢您对校园音乐更换活动的支持,请耐心等待投票开放";
    } else {
      return "您已上传 " + uploaded  + " 首曲目,还可再上传 " + remaining + " 首曲目";
    }
  }

  return (
    <div>
      <Spin spinning={loading.effects["upload/fetch"]}>
        <Alert
          message="温馨提示"
          type="info"
          showIcon
          closable
          description={
            <div>
              文件格式:MP3; 时长:2-5分钟; 大小:2MB-15MB为宜; 不得出现非伴奏人声<br />
              上传前请先查看首页上传说明<br />
              <RemainingNotice />
            </div>
          }
        />
      </Spin>
      <Tabs defaultActiveKey="netease">
        <TabPane tab="网易云音乐" key="netease">
          <CloudUpload />
        </TabPane>
        <TabPane tab="手动上传" key="manual">
          <ManualUpload />
        </TabPane>
        <TabPane tab="我的推荐" key="uploads">
          <ViewUploads />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ upload, loading }) => ({ upload, loading }))(Upload);
