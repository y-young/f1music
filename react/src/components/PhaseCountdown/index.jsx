import { Tooltip, Statistic } from "antd";
import moment from "moment";

const { Countdown } = Statistic;

const PhaseCountdown = ({
  value,
  tooltipPlacement = "bottomLeft",
  ...props
}) => (
  <Tooltip
    title={moment(value).format("YYYY年M月D日 HH:mm:ss")}
    placement={tooltipPlacement}
  >
    <Countdown
      value={moment(value)}
      format="D 天 H 时 m 分 s 秒"
      onFinish={() => window.location.reload()}
      {...props}
    />
  </Tooltip>
);

export default PhaseCountdown;
