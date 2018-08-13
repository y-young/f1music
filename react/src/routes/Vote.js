import React from "react";
import { connect } from "dva";
import { TimeSelector, VoteList } from "components";
import { Alert, Switch } from "antd";

class Vote extends React.Component { 
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.voteList.getWrappedInstance().onRedirect();
    }
  }

  toggleAuto = () => {
    const { dispatch } = this.props;
    dispatch({ type: "vote/toggleAuto" });
  };

  handleRedirect = time => {
    const { dispatch } = this.props;
    this.voteList.getWrappedInstance().onRedirect();
    dispatch({ type: "vote/redirect", payload: time });
  };

  render() {
    const { vote } = this.props;
    const { auto, time } = vote;

    return (
      <div>
        <Alert
          message="投票须知"
          type="info"
          description="试听30秒后显示评分栏,建议试听1分钟以上,详见首页投票说明"
          showIcon
          closable
        />
        <br />
        <TimeSelector
          onChange={this.handleRedirect}
          style={{ width: "90px", marginBottom: "10px" }}
          value={time}
        />
        <div style={{ float: "right", marginTop: "5px" }}>
          <font style={{ color: "#777", fontSize: "14px" }}>自动播放: </font>
          <Switch checked={auto} onChange={this.toggleAuto} />
        </div>
        <VoteList ref={list => (this.voteList = list)} />
      </div>
    );
  }
}

export default connect(({ vote, loading }) => ({ vote, loading }))(Vote);
