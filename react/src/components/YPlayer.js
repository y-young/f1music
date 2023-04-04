import {
  CaretRightOutlined,
  LoadingOutlined,
  PauseOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import { Button, Slider, Space, message } from "antd";
import { Audio, VolumeControl } from "components";
import React from "react";

import styles from "./YPlayer.css";

class YPlayer extends React.Component {
  state = {
    playing: false,
    duration: 0,
    time: 0,
    displayTime: 0,
    loaded: "0.00",
    disableSliderUpdate: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.src !== prevProps.src) {
      this.setState({ disableSliderUpdate: false, duration: 0 });
      this.seek(0);
    }
  }

  onTimeUpdate = event => {
    this.updateTime(event.target.currentTime);
  };

  init = () => {
    this.setState({ disableSliderUpdate: false }, () => {
      this.stop();
    });
  };

  play = disableWarning => {
    if (!this.state.playing) {
      const promise = this.audio.play();
      if (promise) {
        promise.catch(e => {
          console.warn(e);
          if (e.name === "NotAllowedError") {
            // this.stop();
            if (!disableWarning) {
              message.warning(
                "您的浏览器可能不兼容自动播放功能,请尝试手动播放",
              );
            }
          }
        });
      }
      this.setState({ playing: true });
    }
  };

  pause = () => {
    if (this.state.playing) {
      this.audio.pause();
      this.setState({ playing: false });
    }
  };

  toggle = () => {
    if (this.state.playing) {
      this.pause();
    } else {
      this.play();
    }
  };

  stop = () => {
    this.pause();
    this.audio.currentTime = 0;
    this.setState({ time: 0, displayTime: 0, disableSliderUpdate: false });
  };

  onLoad = () => {
    const loaded = this.audio.buffered.length
      ? this.audio.buffered.end(this.audio.buffered.length - 1)
        / this.state.duration
      : 0;
    const percent = (loaded * 100).toFixed(2);
    this.setState({ loaded: percent.toString() });
  };

  onPlay = () => {
    if (!this.state.playing) {
      this.setState({ playing: true });
    }
  };

  onPause = () => {
    if (this.state.playing) {
      this.setState({ playing: false });
    }
    if (this.props.onPause) {
      this.props.onPause();
    }
  };

  updateDuration = event => {
    // event.persist();
    const duration = event.target.duration;
    if (duration !== 1) {
      this.setState({ duration });
    }
  };

  updateTime = time => {
    if (!this.state.disableSliderUpdate) {
      this.setState({ displayTime: time });
    }
    const offset = time - this.state.time;
    if (this.props.onProgress) {
      // offset > 0: In case that currentTime didn't update in time
      // offset <= 1: To prevent cheating
      if (offset > 0 && offset <= 1) {
        this.props.onProgress(offset);
      }
    }
    this.setState({ time });
  };

  onEnded = () => {
    // this.pause();
    if (this.props.onEnded) {
      this.props.onEnded();
    }
  };

  onError = e => {
    this.stop();
    // message.error("播放出错了,请重试");
    throw e;
  };

  onSeeking = time => {
    this.setState({ disableSliderUpdate: true, displayTime: time });
  };

  seek = time => {
    this.setState({
      disableSliderUpdate: false,
      displayTime: time,
      time,
    });
    this.audio.currentTime = time;
  };

  onBackward = () => {
    if (this.props.onBackward) {
      this.props.onBackward();
    }
  };

  onForward = () => {
    if (this.props.onForward) {
      this.props.onForward();
    }
  };

  handleVolumeChange = value => {
    this.audio.volume = value;
  };

  render() {
    const { mini } = this.props;
    const loaded = this.state.loaded;
    const audio = (
      <Audio
        ref={audio => {
          this.audio = audio;
        }}
        src={this.props.src}
        // controls="controls"
        onProgress={this.onLoad}
        onTimeUpdate={this.onTimeUpdate}
        onDurationChange={this.updateDuration}
        onPlay={this.onPlay}
        onPause={this.onPause}
        onEnded={this.onEnded}
        onError={this.onError}
        preload="none"
      />
    );

    if (!mini) {
      return (
        <div>
          {audio}
          <div>
            <Slider
              value={this.state.displayTime}
              max={this.state.duration}
              onChange={this.onSeeking}
              onAfterChange={this.seek}
              tooltip={{ formatter: null }}
            />
            <div className={styles.timeDetail}>
              {this.formatTime(this.state.displayTime)} / {this.formatTime(this.state.duration)}
            </div>
          </div>
          <div className={styles.controls}>
            <Button
              type="secondary"
              shape="circle"
              onClick={this.onBackward}
              disabled={!this.props.canBackward}
              style={{ marginRight: "10px" }}
            >
              <StepBackwardOutlined style={{ color: "#9f9f9f" }} />
            </Button>
            <Button
              type="primary"
              shape="circle"
              size="large"
              onClick={this.toggle}
              disabled={!this.props.src}
            >
              {this.state.playing ? <PauseOutlined /> : <CaretRightOutlined />}
            </Button>
            <Button
              type="secondary"
              shape="circle"
              onClick={this.onForward}
              disabled={!this.props.canForward}
              style={{ marginLeft: "10px" }}
            >
              <StepForwardOutlined style={{ color: "#9f9f9f" }} />
            </Button>
            <VolumeControl
              onChange={this.handleVolumeChange}
              className={styles.volumeControl}
            />
          </div>
          <div
            className={styles.bufferDetail}
            style={!this.props.src ? { display: "none" } : {}}
          >
            {loaded !== "100.00" && <LoadingOutlined style={{ marginRight: "2px" }} />}
            {loaded === "100.00"
              ? "缓冲完毕"
              : (loaded !== "0.00" && `${loaded}%`)}
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.miniPlayer}>
          {audio}
          <Space.Compact className={styles.controls}>
            <Button type="primary" onClick={this.toggle}>
              {this.state.playing ? <PauseOutlined /> : <CaretRightOutlined />}
            </Button>
            <Button type="primary" onClick={this.stop}>
              <StepBackwardOutlined />
            </Button>
          </Space.Compact>
          <div className={styles.miniTimeDetail}>
            {this.formatTime(this.state.displayTime)} / {this.formatTime(this.state.duration)}
          </div>
          <VolumeControl
            onChange={this.handleVolumeChange}
            className={styles.volumeControl}
          />
        </div>
      );
    }
  }

  formatTime(duration) {
    if (isNaN(duration)) {
      return "00:00";
    }
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration - hours * 3600) / 60);
    const seconds = Math.floor(duration - hours * 3600 - minutes * 60);
    const add0 = num => {
      return num < 10 ? `0${num}` : `${num}`;
    };
    return (hours > 0 ? [hours, minutes, seconds] : [minutes, seconds])
      .map(add0)
      .join(":");
  }
}

export default YPlayer;
