import React from 'react';
import { connect } from 'dva';
import { Collapse, Spin } from 'antd';
import VoteItem from './VoteItem';

const Panel = Collapse.Panel;

class VoteList extends React.Component {
// TODO: 跳转时段后停止播放
  handleChange = (index) => {
    const { dispatch, vote } = this.props;
    const { lastIndex, auto } = vote;
    if(lastIndex) {
      const player = this.refs["item"+lastIndex].getWrappedInstance();
      player.stop();
    }
    dispatch({ type: 'vote/init' });
    dispatch({ type: 'vote/setNowIndex', payload: index });
    dispatch({ type: 'vote/updateLastIndex', payload: index });
    if(auto && index) {
      const player = this.refs["item"+index].getWrappedInstance();
      player.play();
    }
    return index;
  }

  handleAuto = (submitted) => {
    const { dispatch, vote } = this.props;
    const { songs, auto, newIndex, nowIndex } = vote;
    if (!submitted) {
      const nextIndex =  String(Number(nowIndex) + 1);
      dispatch({ type: 'vote/updateNewIndex', payload: nextIndex });
      // Try to solve the problem of 'play() can only be initiated by a user gesture by playing and immediately stoping it
      if(songs[nextIndex] && auto) {
        const player = this.refs["item"+nextIndex].getWrappedInstance();
        player.play();
        player.stop();
      }
    } else {
      if(songs[newIndex] && auto) {
        // dispatch({ type: 'vote/setNowIndex', payload: newIndex });
        this.handleChange(newIndex);
      }
    }
  }

  render() {
    const { vote, loading } = this.props;
    const { songs, nowIndex } = vote;
    const listLoading = loading.effects['vote/fetch'];
    const list = songs.map((song, key) => {
      return (
        <Panel header={'#'+(key+1)+' 您的投票: '+song.vote} key={key} forceRender={true} >
          <VoteItem song={song} handleAuto={this.handleAuto} ref={"item"+key} />
        </Panel>
      )});


      return (
        <Spin spinning={listLoading}>
          <Collapse accordion bordered={false} onChange={this.handleChange} activeKey={nowIndex}>
            { list }
          </Collapse>
        </Spin>
      )
  }
}

export default connect(({ vote, loading }) => ({ vote, loading }))(VoteList);
