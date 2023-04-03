import { Progress } from "antd";
import useIsDesktop from "hooks/useIsDesktop";

const VoteProgress = ({ progress }) => {
  const isDesktop = useIsDesktop();
  const percent = progress[1] ? (progress[0] / progress[1]) * 100 : 0;
  const props = !isDesktop ? { type: "circle", width: 75 } : {};

  return (
    <div className="ant-statistic">
      <div className="ant-statistic-title">本时段投票进度</div>
      <div className="ant-statistic-content">
        <Progress percent={percent} trailColor="#fff" {...props} />
      </div>
    </div>
  );
};

export default VoteProgress;
