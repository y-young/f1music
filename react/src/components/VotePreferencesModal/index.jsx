import React, { useState } from "react";
import { Form, Radio, Button, Modal, Switch } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import useVotePreferences from "../../hooks/useVotePreferences";

const FormItem = Form.Item;

const VotePreferencesModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [preferences, setPreferences] = useVotePreferences();

  return (
    <>
      <Button type="secondary" onClick={() => setModalVisible(true)}>
        <SettingOutlined />
        偏好设置
      </Button>
      <Modal
        title="偏好设置"
        centered
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form>
          <FormItem label="自动跳过已投票曲目">
            <Switch
              checked={preferences.skipVoted}
              onChange={value =>
                setPreferences({ ...preferences, skipVoted: value })
              }
            />
          </FormItem>
          <FormItem label="手动提交成功后">
            <Radio.Group
              defaultValue={preferences.onSubmitted}
              onChange={e =>
                setPreferences({ ...preferences, onSubmitted: e.target.value })
              }
              buttonStyle="solid"
            >
              <Radio.Button value="continue">继续播放</Radio.Button>
              <Radio.Button value="forward">切换下一首</Radio.Button>
            </Radio.Group>
          </FormItem>
          <FormItem label="播放结束但未投票时:">
            <Radio.Group
              defaultValue={preferences.onEnded}
              onChange={e =>
                setPreferences({ ...preferences, onEnded: e.target.value })
              }
              buttonStyle="solid"
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
