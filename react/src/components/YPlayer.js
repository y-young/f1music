import React from "react";
import styles from "./YPlayer.css";
import { Button, Slider, Icon, message } from "antd";

const ButtonGroup = Button.Group;

class YPlayer extends React.Component {
  state = {
    playing: false,
    duration: 0,
    time: 0,
    displayTime: 0,
    loaded: "0.00",
    disableSliderUpdate: false,
    prevPropsSrc: this.props.src
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
            //this.stop();
            if (!disableWarning) {
              message.warning(
                "您的浏览器可能不兼容自动播放功能,请尝试手动播放"
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
      ? this.audio.buffered.end(this.audio.buffered.length - 1) /
        this.state.duration
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
    //event.persist();
    const duration = event.target.duration;
    if (duration >= 120) {
      this.setState({ duration });
    }
  };

  updateTime = time => {
    if (!this.state.disableSliderUpdate) {
      this.setState({ displayTime: time });
    }
    const offset = time - this.state.time;
    if (this.props.onProgress) {
      //offset > 0: In case that currentTime didn't update in time
      //offset <= 1: To prevent cheating
      if (offset > 0 && offset <= 1) {
        this.props.onProgress(offset);
      }
    }
    this.setState({ time: time });
  };

  onEnded = () => {
    //this.pause();
    if (this.props.onEnded) {
      this.props.onEnded();
    }
  };

  onError = e => {
    this.stop();
    //message.error("播放出错了,请重试");
    throw e;
  };

  onSeeking = time => {
    this.setState({ disableSliderUpdate: true, displayTime: time });
  };

  seek = time => {
    this.setState({
      disableSliderUpdate: false,
      displayTime: time,
      time: time
    });
    this.audio.currentTime = time;
  };

  render() {
    const { mini } = this.props;
    const loaded = this.state.loaded;
    const audio = (
      <audio
        ref={audio => {
          this.audio = audio;
        }}
        src={this.props.src}
        controls="controls"
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
              tipFormatter={null}
            />
            <div className={styles.timeDetail}>
              {this.formatTime(this.state.displayTime)} /{" "}
              {this.formatTime(this.state.duration)}
            </div>
          </div>
          <div className={styles.controls}>
            <Button
              type="secondary"
              shape="circle"
              style={{ marginRight: "10px" }}
            >
              {this.state.disableSliderUpdate ? "1" : "0"}
              <Icon type="backward" style={{ color: "#9f9f9f" }} />
            </Button>
            <Button
              type="primary"
              shape="circle"
              size="large"
              onClick={this.toggle}
              disabled={this.props.src === ""}
            >
              <Icon type={this.state.playing ? "pause" : "caret-right"} />
            </Button>
            <Button
              type="secondary"
              shape="circle"
              onClick={this.stop}
              style={{ marginLeft: "10px" }}
            >
              <Icon type="forward" style={{ color: "#9f9f9f" }} />
            </Button>
          </div>
          <div
            className={styles.bufferDetail}
            style={!this.props.src ? { display: "none" } : {}}
          >
            {loaded !== "100.00" && (
              <Icon type="loading" style={{ marginRight: "2px" }} />
            )}
            {loaded === "100.00"
              ? "缓冲完毕"
              : loaded !== "0.00" && loaded + "%"}
          </div>
        </div>
      );
    } else {
      return (
        <span style={{ width: 150 }}>
          {audio}
          <div className={styles.miniTimeDetail}>
            {this.formatTime(this.state.displayTime)} /{" "}
            {this.formatTime(this.state.duration)}
          </div>
          <ButtonGroup className={styles.controls}>
            <Button type="primary" onClick={this.toggle}>
              <Icon type={this.state.playing ? "pause" : "caret-right"} />
            </Button>
            <Button type="primary" onClick={this.stop}>
              <Icon type="step-backward" />
            </Button>
          </ButtonGroup>
        </span>
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
      return num < 10 ? "0" + num : "" + num;
    };
    return (hours > 0 ? [hours, minutes, seconds] : [minutes, seconds])
      .map(add0)
      .join(":");
  }
}

export default YPlayer;
