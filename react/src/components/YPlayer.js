import React from 'react';
import _ from 'lodash';
import styles from './YPlayer.css';
import { Button, Slider, Icon } from 'antd';
const ButtonGroup = Button.Group;

class YPlayer extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      duration: 0,
      time: 0,
      loaded: 0
    };
    this.updateTime = _.debounce(this.updateTime, 200);
  }

  onTimeUpdate = (event) => {
    this.updateTime(event.target.currentTime);
  }

  play() {
    this.audio.play();
    this.setState({playing: true});
  }

  toggle = () => {
    if (this.state.playing)
      this.audio.pause();
    else this.audio.play();
    this.setState({playing: !this.state.playing});
  }

  stop = () => {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.setState({playing: false});
  }

  onLoad = () => {
    let loaded = this.audio.buffered.length ? this.audio.buffered.end(this.audio.buffered.length - 1) / this.audio.duration : 0;
    this.setState({loaded: loaded});
  }

  render() {
    const { mini } = this.props;
    return (
      <div>
        <audio
          ref={(audio) => {this.audio = audio}}
          src={this.props.src}
          onTimeUpdate={this.onTimeUpdate}
          onDurationChange={this.updateDuration}
          onEnded={this.ended} preload="metadata" />
        { !mini &&
        (<div>
          <Slider value={this.state.time} max={this.state.duration} tipFormatter={null} />
          <div className={styles.timeDetail}>{ this.formatTime(this.state.time) } / { this.formatTime(this.state.duration) }</div>
        </div>)
        }
        <ButtonGroup className={styles.controls}>
            <Button type="primary" onClick={this.toggle}><Icon type={ this.state.playing ? "pause" : "caret-right"} /></Button>
            <Button type="primary" onClick={this.stop}><Icon type="step-backward" /></Button>
        </ButtonGroup>
        {/*<div className={styles.control}>
           { this.state.loaded }
        </div>*/}
    </div>
    );
  }

  onProgress = (e) => {
    e.persist();
    this.props.onProgress(this.state.time);
  }

  updateDuration = (e) => {
    e.persist();
    //console.log(e.target.duration);
    this.setState({ duration: e.target.duration });
  }

  updateTime = (time) => {
    this.setState({ time: time });
    if(this.props.onProgress) {
      this.props.onProgress(time);
    }
  }

  ended = () => {
    this.setState({playing: false});
    this.props.onEnded();
  }

  formatTime(seconds) {
    if (isNaN(seconds))
      return '00:00';
    const min = parseInt(seconds / 60, 10);
    const sec = parseInt(seconds - min * 60, 10);
    const hours = parseInt(min / 60, 10);
    const newMin = parseInt((seconds / 60) - (60 * parseInt((seconds / 60) / 60, 10)), 10);
    const add0 = (num) => {
      return num < 10 ? '0' + num : '' + num;
    };
    return seconds >= 3600 ? add0(hours) + ':' + add0(newMin) + ':' + add0(sec) : add0(min) + ':' + add0(sec);
  }
};

export default YPlayer;
