import { Button } from "antd";
import {
  CaretRightOutlined,
  PauseOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";

export const PlayButton = ({ playing, ...props }) => (
  <Button type="primary" title={playing ? "暂停" : "播放"} {...props}>
    {playing ? <PauseOutlined /> : <CaretRightOutlined />}
  </Button>
);

export const StopButton = (props) => (
  <Button type="primary" title="停止" {...props}>
    <StepBackwardOutlined />
  </Button>
);

const NavigationButton = ({ disabled, Icon, ...props }) => (
  <Button shape="circle" {...props} disabled={disabled}>
    <Icon style={{ color: disabled ? "inherit" : "#9f9f9f" }} />
  </Button>
);

export const BackwardButton = (props) => (
  <NavigationButton title="上一首" {...props} Icon={StepBackwardOutlined} />
);

export const ForwardButton = (props) => (
  <NavigationButton title="下一首" {...props} Icon={StepForwardOutlined} />
);
