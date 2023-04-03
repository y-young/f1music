import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Spin, Input, Rate, Button, message } from "antd";
import { BulbOutlined, CheckOutlined } from "@ant-design/icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import styles from "./index.module.less";
import Player from "../Player";
import { voteTexts } from "config";
import useIsDesktop from "../../hooks/useIsDesktop";
import useVotePreferences from "../../hooks/useVotePreferences";
import { useVoteList, useVote, useReport } from "services/vote";

const VoteList = ({ time }) => {
  const isDesktop = useIsDesktop();
  const [preferences] = useVotePreferences();

  const voteList = useVoteList(time);
  const songs = voteList.data ?? [];

  const vote = useVote();
  const report = useReport();

  const playerRef = useRef(null);
  const [rate, setRate] = useState(0);
  const [src, setSrc] = useState(undefined);
  const [reason, setReason] = useState("");
  const [index, setIndex] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [triggerVote, setTriggerVote] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [canBackward, setCanBackward] = useState(false);
  const [canForward, setCanForward] = useState(false);

  const init = () => {
    setRate(0);
    setCountdown(30);
    setReason("");
    setCanSubmit(false);
    setShowReport(false);
    setTriggerVote(true);
    setCanBackward(false);
    setCanForward(false);
  };

  useEffect(() => {
    stopLast();
    setIndex("");
    setSrc(undefined);
    init();
  }, [time]);

  useEffect(() => {
    if (src) {
      playerRef.current.play();
    }
  }, [src]);

  useEffect(() => {
    updateButtonStatus(index);
  }, [index]);

  const stopLast = () => {
    if (playerRef.current) {
      playerRef.current.stop();
    }
  };

  const timeListener = (offset) => {
    const song = songs[index];

    if (countdown > 0) {
      setCountdown((prevCountdown) => prevCountdown - offset);
    } else {
      if (!song.listened && song.vote === 0) {
        voteList.markListened(song.id);
      }
      // triggerVote: Only when first listen
      if (triggerVote) {
        setTriggerVote(false);
        handleVote();
      }
    }
  };

  const handleSwitch = (newIndex) => {
    const player = playerRef.current;

    if (index === newIndex) {
      player.toggle();
      return index;
    }

    setIndex(newIndex);
    stopLast();
    init();
    setSrc(songs[newIndex].url);

    if (songs[newIndex].vote !== 0 || songs[newIndex].listened) {
      setCountdown(0);
      setRate(songs[newIndex].vote);
      setTriggerVote(false);
    } else {
      setCountdown(30);
    }
    return newIndex;
  };

  const updateButtonStatus = (index) => {
    if (index === "") {
      return;
    }
    const previous = Number(index) - 1;
    const next = Number(index) + 1;
    setCanBackward(songs[previous] !== undefined);
    setCanForward(songs[next] !== undefined);
  };

  const forward = () => {
    const { skipVoted } = preferences;
    let newIndex = Number(index) + 1;
    if (skipVoted) {
      while (songs[newIndex] && songs[newIndex].vote !== 0) {
        newIndex++;
      }
    }
    if (songs[newIndex]) {
      handleSwitch(newIndex);
    } else if (skipVoted) {
      message.info("您已选择跳过已投票歌曲，如无需要请修改偏好设置");
    }
  };

  const backward = () => {
    const { skipVoted } = preferences;
    let newIndex = Number(index) - 1;
    if (skipVoted) {
      while (songs[newIndex] && songs[newIndex].vote !== 0) {
        newIndex--;
      }
    }
    if (songs[newIndex]) {
      handleSwitch(newIndex);
    } else if (skipVoted) {
      message.info("您已选择跳过已投票歌曲，如无需要请修改偏好设置");
    }
  };

  const checkValidity = () => {
    if (countdown > 0) {
      message.warning("试听时长需达到30秒才能投票");
      const player = playerRef.current;
      player.audio.currentTime = 0;
      player.play();
      return "time";
    }
    if (!canSubmit || rate === 0) {
      message.info("选择或更改评价后即可提交");
      return "rate";
    }
    return "valid";
  };

  const handleVote = async (type = null) => {
    const { onSubmitted } = preferences;
    const song = songs[index];
    const validity = checkValidity();
    if (validity !== "valid") {
      return;
    }
    const id = song.id;
    await vote.trigger({ id, vote: rate }).then(() => {
      message.success("投票成功");
      setCanSubmit(false);
      voteList.updateVote(id, rate);
      if (
        (type === "manual" && onSubmitted === "forward") ||
        type === "ended"
      ) {
        forward();
      }
    });
  };

  const onEnded = () => {
    const { onEnded } = preferences;
    const song = songs[index];
    const validity = checkValidity();
    if (song.vote === 0) {
      if (validity === "valid") {
        handleVote("ended");
      } else if (validity === "rate" && onEnded === "forward") {
        forward();
      }
    } else {
      forward();
    }
  };

  const submitReport = async () => {
    if (!reason) {
      message.error("请填写反馈内容");
      return;
    }
    const id = songs[index].id;
    await report.trigger({ id, reason }).then(() => {
      message.success("提交成功");
      setShowReport(false);
    });
  };

  const handleRatingChange = (value) => {
    setRate(value);
    setCanSubmit(true);
  };

  const song = songs[index] ? songs[index] : { vote: 0 };
  const buttonProps = {
    type: song.vote !== 0 ? "secondary" : "primary",
    shape: !isDesktop ? "circle" : undefined,
    icon: countdown <= 0 ? <CheckOutlined /> : undefined,
    disabled: countdown > 0
  };

  const voteArea = (
    <div className={styles.voteArea} key="vote">
      <hr />
      {countdown <= 15 ? (
        <div>
          <Rate
            value={rate}
            onChange={handleRatingChange}
            allowClear={false}
            className={styles.rate}
          />
          {rate !== 0 && (
            <div className={styles.voteText}>
              <span className="ant-rate-text">{voteTexts[rate]}</span>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.voteText}>
          <span className="ant-rate-text" style={{ color: "#777" }}>
            试听15秒后显示评分栏
          </span>
        </div>
      )}
      <Button
        loading={vote.isMutating}
        className={styles.voteButton}
        onClick={() => handleVote("manual")}
        {...buttonProps}
      >
        {countdown > 0 ? Math.ceil(countdown) : isDesktop && "投票"}
      </Button>
    </div>
  );

  const reportArea = (
    <div className={styles.reportArea} key="report">
      <div className={styles.reason}>
        <Input
          value={reason}
          placeholder="反馈内容"
          onChange={(e) => setReason(e.target.value)}
          maxLength={200}
          onPressEnter={submitReport}
        />
      </div>
      <Button
        type="primary"
        onClick={submitReport}
        loading={report.isMutating}
        className={styles.reportButton}
      >
        提交
      </Button>
    </div>
  );

  const list = songs.map((song, key) => {
    const current = key === index;
    return (
      <li
        style={current ? { color: "#1890ff" } : {}}
        className={styles.listItem}
        onClick={() => handleSwitch(key)}
        key={key}
      >
        <span className={styles.itemIndex}>{key + 1}</span>
        {"您的评价: " + voteTexts[song.vote]}
      </li>
    );
  });

  const notice = () => {
    let voted = 0;
    songs.forEach((song) => {
      if (song.vote !== 0) {
        voted++;
      }
    });
    if (voted === songs.length) {
      let rndTime;
      do {
        rndTime = Math.floor(Math.random() * 5 + 1);
      } while (rndTime === time);
      return (
        <div className="tips">
          <BulbOutlined /> 您已投完本时段所有曲目，到
          <Link to={"/vote/" + rndTime}>其他时段</Link>
          看看吧
        </div>
      );
    } else {
      return (
        <div className="tips">
          <BulbOutlined /> 本时段您已投 {voted} 首曲目，还有{" "}
          {songs.length - voted} 首未投票曲目
        </div>
      );
    }
  };

  return (
    <Spin spinning={voteList.isLoading}>
      {songs.length !== 0 ? (
        <>
          <div>
            <Player
              src={src}
              onProgress={timeListener}
              onEnded={onEnded}
              canBackward={canBackward}
              canForward={canForward}
              onBackward={backward}
              onForward={forward}
              ref={playerRef}
              className={styles.player}
            />
            <br />
            <Button
              size="small"
              onClick={() => setShowReport((showReport) => !showReport)}
              disabled={index === ""}
              className={styles.toggleReport}
            >
              反馈
            </Button>
          </div>
          <br />
          {voteArea}
          <TransitionGroup>
            {showReport && (
              <CSSTransition
                classNames="fade"
                timeout={{ enter: 500, exit: 200 }}
              >
                {reportArea}
              </CSSTransition>
            )}
          </TransitionGroup>
          <ol className={styles.list}>{list}</ol>
          {notice()}
        </>
      ) : (
        <div className="tips">投票未开放或暂无数据</div>
      )}
    </Spin>
  );
};

export default VoteList;
