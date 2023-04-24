import { Progress } from "antd";
import classnames from "classnames";
import useIsDesktop from "hooks/useIsDesktop";

import styles from "./index.module.less";

const VoteProgress = ({ progress }) => {
  const isDesktop = useIsDesktop();
  const percent = progress[1] ? (progress[0] / progress[1]) * 100 : 0;
  const props = isDesktop ? {} : { type: "circle", size: 75 };

  return (
    <div className={classnames("ant-statistic", styles.statistic)}>
      <div className="ant-statistic-title">本时段投票进度</div>
      <div className={classnames("ant-statistic-content", styles.progress)}>
        <Progress percent={percent} trailColor="#fff" {...props} />
      </div>
    </div>
  );
};

export default VoteProgress;
