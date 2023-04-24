import { forwardRef, useState } from "react";
import { Button, Input, message } from "antd";
import { useReport } from "services/vote";

import styles from "./index.module.less";

const ReportForm = ({ id, onSubmitted }, ref) => {
  const [reason, setReason] = useState("");
  const report = useReport();

  const submitReport = async () => {
    if (!reason) {
      message.error("请填写反馈内容");
      return;
    }
    await report
      .trigger({ id, reason })
      .then(() => {
        message.success("提交成功");
        setReason("");
        onSubmitted?.();
      })
      .catch(() => {});
  };

  return (
    <div ref={ref} key="report" className={styles.reportArea}>
      <div className={styles.reason}>
        <Input
          value={reason}
          placeholder="反馈内容"
          maxLength={200}
          onChange={(e) => setReason(e.target.value)}
          onPressEnter={submitReport}
        />
      </div>
      <Button
        type="primary"
        loading={report.isMutating}
        className={styles.reportButton}
        onClick={submitReport}
      >
        提交
      </Button>
    </div>
  );
};

export default forwardRef(ReportForm);
