import React from "react";
import throttle from "lodash/throttle";
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
    disableSliderUpdate: false
  };
  constructor(props) {
    super(props);
    if (props.audio) {
      this.audio = props.audio;
      this.audio.addEventListener("progress", this.onLoad);
      this.audio.addEventListener("timeupdate", this.onTimeUpdate);
      this.audio.addEventListener("durationchange", this.updateDuration);
      this.audio.addEventListener("play", this.onPlay);
      this.audio.addEventListener("pause", this.onPause);
      this.audio.addEventListener("ended", this.onEnded);
      this.audio.addEventListener("error", this.onError);
    }
    this.updateTime = throttle(this.updateTime, 300);
  }

  onTimeUpdate = event => {
    this.updateTime(event.target.currentTime);
  };

  init = () => {
    this.setState({
      time: 0,
      playing: false
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
    if (this.props.onPlay) {
      this.props.onPlay();
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
      console.log(offset);
      if (offset > 0 && offset <= 1) {
        this.props.onProgress(offset);
      }
    }
    this.setState({ time: time });
  };

  onEnded = () => {
    this.setState({ playing: false });
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
    let audio = null;
    if (!this.props.audio) {
      audio = (
        <audio
          ref={audio => {
            this.audio = audio;
          }}
          src={this.props.src}
          //controls="controls"
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
    }
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
          <ButtonGroup className={styles.controls}>
            <Button type="primary" onClick={this.toggle}>
              <Icon type={this.state.playing ? "pause" : "caret-right"} />
            </Button>
            <Button type="primary" onClick={this.stop}>
              <Icon type="step-backward" />
            </Button>
          </ButtonGroup>
          <div className={styles.bufferDetail}>
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

  formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const min = parseInt(seconds / 60, 10);
    const sec = parseInt(seconds - min * 60, 10);
    const hours = parseInt(min / 60, 10);
    const newMin = parseInt(
      seconds / 60 - 60 * parseInt(seconds / 60 / 60, 10),
      10
    );
    const add0 = num => {
      return num < 10 ? "0" + num : "" + num;
    };
    return seconds >= 3600
      ? add0(hours) + ":" + add0(newMin) + ":" + add0(sec)
      : add0(min) + ":" + add0(sec);
  }
}

export default YPlayer;
