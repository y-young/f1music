import { useState } from "react";
import { Button, Form, Modal, Radio, Switch } from "antd";
import { SettingOutlined } from "@ant-design/icons";

import useVotePreferences from "../../hooks/useVotePreferences";

const FormItem = Form.Item;

const VotePreferencesModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [preferences, setPreferences] = useVotePreferences();

  return (
    <>
      <Button onClick={() => setModalVisible(true)}>
        <SettingOutlined />
        偏好设置
      </Button>
      <Modal
        centered
        title="偏好设置"
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <Form labelCol={{ span: 8 }}>
          <FormItem label="自动跳过已投票曲目">
            <Switch
              checked={preferences.skipVoted}
              onChange={(value) =>
                setPreferences({ ...preferences, skipVoted: value })
              }
            />
          </FormItem>
          <FormItem label="手动提交成功后">
            <Radio.Group
              defaultValue={preferences.onSubmitted}
              buttonStyle="solid"
              onChange={(e) =>
                setPreferences({ ...preferences, onSubmitted: e.target.value })
              }
            >
              <Radio.Button value="continue">继续播放</Radio.Button>
              <Radio.Button value="forward">切换下一首</Radio.Button>
            </Radio.Group>
          </FormItem>
          <FormItem label="播放结束但未投票时:">
            <Radio.Group
              defaultValue={preferences.onEnded}
              buttonStyle="solid"
              onChange={(e) =>
                setPreferences({ ...preferences, onEnded: e.target.value })
              }
            >
              <Radio.Button value="pause">暂停</Radio.Button>
              <Radio.Button value="forward">播放下一首</Radio.Button>
            </Radio.Group>
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default VotePreferencesModal;
