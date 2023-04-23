import { Button, Slider, Popover } from "antd";
import { SoundOutlined } from "@ant-design/icons";
import useAudioVolume from "hooks/useAudioVolume";

const VolumeControl = ({ onChange, ...props }) => {
  const [volume] = useAudioVolume();
  const iconStyle = { color: "#b9b9b9" };

  return (
    <Popover
      placement="right"
      content={
        <Slider
          value={volume}
          max={1}
          step={0.01}
          min={0}
          tooltip={{ formatter: (value) => (value * 100).toFixed(0) }}
          onChange={onChange}
          style={{ width: 100, margin: 0 }}
        />
      }
    >
      <Button
        icon={<SoundOutlined style={iconStyle} />}
        shape="circle"
        type="text"
        title="音量"
        {...props}
      />
    </Popover>
  );
};

export default VolumeControl;
