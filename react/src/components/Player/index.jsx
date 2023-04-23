import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";
import styles from "./index.module.less";
import { Slider, message, Space } from "antd";
import { Audio } from "components";
import VolumeControl from "./VolumeControl";
import {
  PlayButton,
  StopButton,
  BackwardButton,
  ForwardButton
} from "./ControlButtons";

const Player = (
  {
    src,
    onPause,
    onProgress,
    onEnded,
    onBackward,
    onForward,
    canBackward,
    canForward,
    mini = false
  },
  ref
) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [disableSliderUpdate, setDisableSliderUpdate] = useState(false);

  useImperativeHandle(ref, () => ({
    play,
    pause,
    stop,
    toggle,
    audio: audioRef.current
  }));

  useEffect(() => {
    setDisableSliderUpdate(false);
    // Setting Slider value & max to 0 at the same time won't reset the handle
    // https://github.com/ant-design/ant-design/issues/40827
    setDuration(0.01);
    setLoaded(0);
    seek(0);
  }, [src]);

  const handleTimeUpdate = (event) => {
    const newTime = event.target.currentTime;
    if (!disableSliderUpdate) {
      setDisplayTime(newTime);
    }
    const offset = newTime - time;
    if (onProgress) {
      // offset > 0: In case that currentTime didn't update in time
      // offset <= 1: To prevent cheating
      if (offset > 0 && offset <= 1) {
        onProgress(offset);
      }
    }
    setTime(newTime);
  };

  const play = (disableWarning = false) => {
    if (!playing) {
      const promise = audioRef.current.play();
      if (promise) {
        promise.catch((e) => {
          console.warn(e);
          if (e.name === "NotAllowedError") {
            // stop();
            if (!disableWarning) {
              message.warning(
                "您的浏览器可能不兼容自动播放功能,请尝试手动播放"
              );
            }
          }
        });
      }
      setPlaying(true);
    }
  };

  const pause = () => {
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const toggle = () => {
    if (playing) {
      pause();
    } else {
      play();
    }
  };

  const stop = () => {
    pause();
    audioRef.current.currentTime = 0;
    setTime(0);
    setDisplayTime(0);
    setDisableSliderUpdate(false);
  };

  const handleLoad = () => {
    const audio = audioRef.current;
    const loaded = audio.buffered.length
      ? audio.buffered.end(audio.buffered.length - 1) / duration
      : 0;
    const percent = loaded * 100;
    setLoaded(Math.min(percent, 100));
  };

  const handlePlay = () => {
    if (!playing) {
      setPlaying(true);
    }
  };

  const handlePause = () => {
    if (playing) {
      setPlaying(false);
    }
    if (onPause) {
      onPause();
    }
  };

  const updateDuration = (event) => {
    // event.persist();
    const duration = event.target.duration;
    if (duration !== 1) {
      setDuration(duration);
    }
  };

  const handleEnded = () => {
    // pause();
    if (onEnded) {
      onEnded();
    }
  };

  const handleError = (e) => {
    e.persist();
    stop();
    console.log(e);
    // message.error("播放出错了,请重试");
    throw e;
  };

  const handleSeeking = (time) => {
    setDisableSliderUpdate(true);
    setDisplayTime(time);
  };

  const seek = (time) => {
    setDisableSliderUpdate(false);
    setDisplayTime(time);
    setTime(time);
    audioRef.current.currentTime = time;
  };

  const handleVolumeChange = (value) => {
    audioRef.current.volume = value;
  };

  const formatTime = (duration) => {
    if (isNaN(duration)) {
      return "00:00";
    }
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration - hours * 3600) / 60);
    const seconds = Math.floor(duration - hours * 3600 - minutes * 60);
    return (hours > 0 ? [hours, minutes, seconds] : [minutes, seconds])
      .map((value) => value.toString().padStart(2, "0"))
      .join(":");
  };

  const timeDetail = `${formatTime(displayTime)} / ${formatTime(duration)}`;
  const audio = (
    <Audio
      ref={audioRef}
      src={src}
      //controls="controls"
      onProgress={handleLoad}
      onTimeUpdate={handleTimeUpdate}
      onDurationChange={updateDuration}
      onPlay={handlePlay}
      onPause={handlePause}
      onEnded={handleEnded}
      onError={handleError}
      preload="none"
    />
  );

  if (mini) {
    return (
      <div className={styles.miniPlayer}>
        {audio}
        <Space.Compact className={styles.controls}>
          <PlayButton onClick={toggle} playing={playing} />
          <StopButton onClick={stop} />
        </Space.Compact>
        <div className={styles.miniTimeDetail}>{timeDetail}</div>
        <VolumeControl
          onChange={handleVolumeChange}
          className={styles.volumeControl}
        />
      </div>
    );
  }

  return (
    <div>
      {audio}
      <Slider
        value={displayTime}
        max={duration}
        onChange={handleSeeking}
        onAfterChange={seek}
        tooltip={{ formatter: null }}
        className={styles.slider}
        style={{ "--buffer-progress": `${loaded}%` }}
      />
      <Space className={styles.controls}>
        <BackwardButton onClick={onBackward} disabled={!canBackward} />
        <PlayButton
          shape="circle"
          size="large"
          playing={playing}
          onClick={toggle}
          disabled={!src}
        />
        <ForwardButton onClick={onForward} disabled={!canForward} />
        <VolumeControl
          onChange={handleVolumeChange}
          className={styles.volumeControl}
        />
      </Space>
      <div className={styles.timeDetail}>{timeDetail}</div>
    </div>
  );
};

export default forwardRef(Player);
