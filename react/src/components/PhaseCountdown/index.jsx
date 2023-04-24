import { Statistic, Tooltip } from "antd";
import dayjs from "dayjs";

const { Countdown } = Statistic;

const PhaseCountdown = ({
  value,
  tooltipPlacement = "bottomLeft",
  ...props
}) => (
  <Tooltip
    title={dayjs(value).format("YYYY年M月D日 HH:mm:ss")}
    placement={tooltipPlacement}
  >
    <Countdown
      value={dayjs(value)}
      format="D 天 H 时 m 分 s 秒"
      onFinish={() => window.location.reload()}
      {...props}
    />
  </Tooltip>
);

export default PhaseCountdown;
