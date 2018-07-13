import React from 'react'
import { connect } from 'dva'
import { VoteList } from 'components'
import { Select, Alert, Switch } from 'antd'

const Option = Select.Option

const Vote = ({ match, vote, dispatch }) => {

  const { songs, auto } = vote;

  const toggleAuto = () => {
    dispatch({ type: 'vote/toggleAuto' });
  }

  return (
    <div>
    <Alert message="温馨提示" type="info" description="试听30秒后显示评分栏,建议试听1分钟以上,详见首页投票说明" showIcon closable /><br/>
    <Select placeholder="选择时段" style={{width: "90px", marginBottom: "10px"}} value={match.params.time} >
    <Option value="1">6:30</Option>
    <Option value="2">7:00</Option>
    <Option value="3">13:45</Option>
    <Option value="4">18:40</Option>
    <Option value="5">21:35</Option>
    <Option value="6">22:30</Option>
    </Select>
    <div style={{float: "right", marginTop: "5px"}}><font style={{color: "#777", fontSize: "14px"}}>自动播放: </font><Switch checked={auto} onChange={toggleAuto}/></div>
    <VoteList />
    </div>
  );
}

export default connect(({vote, loading}) => ({vote, loading}))(Vote)
