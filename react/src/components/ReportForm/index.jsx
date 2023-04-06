import { forwardRef, useState } from "react";
import { Input, Button, message } from "antd";
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
    <div ref={ref} className={styles.reportArea} key="report">
      <div className={styles.reason}>
        <Input
          value={reason}
          placeholder="反馈内容"
          onChange={(e) => setReason(e.target.value)}
          maxLength={200}
          onPressEnter={submitReport}
        />
      </div>
      <Button
        type="primary"
        onClick={submitReport}
        loading={report.isMutating}
        className={styles.reportButton}
      >
        提交
      </Button>
    </div>
  );
};

export default forwardRef(ReportForm);
