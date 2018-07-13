import React from 'react'
import { Alert, Tabs } from 'antd'
import { CloudUpload, ManualUpload } from 'components'

const TabPane = Tabs.TabPane

const Upload = () => {
  return (
    <div>
    <Alert message="曲目要求" type="info" showIcon closable description={
        <div>格式:MP3; 时长:2-5分钟; 大小:2MB-15MB为宜; 不得出现非伴奏人声<br/>上传前请先查看上传说明</div>} />
    <Tabs defaultActiveKey="netease">
      <TabPane tab="网易云音乐" key="netease">
        <CloudUpload />
      </TabPane>
      <TabPane tab="手动上传" key="manual">
        <ManualUpload />
      </TabPane>
    </Tabs>
    </div>
  );
}

export default Upload
