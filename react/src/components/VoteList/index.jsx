import React, { useEffect, useRef, useState } from "react";
import { Spin, Rate, Button, message, Empty, Menu, Card } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import styles from "./index.module.less";
import Player from "../Player";
import { voteTexts } from "config";
import useIsDesktop from "hooks/useIsDesktop";
import useVotePreferences from "hooks/useVotePreferences";
import { useVoteList, useVote } from "services/vote";
import { ReportForm } from "components";
import classNames from "classnames";
import Tips from "./Tips";

const RATE_DURATION = 15;
const SUBMIT_DURATION = 30;

const VoteList = ({ time }) => {
  const isDesktop = useIsDesktop();
  const [preferences] = useVotePreferences();

  const voteList = useVoteList(time);
  const songs = voteList.data;
  const vote = useVote();

  const playerRef = useRef(null);
  const reportFormRef = useRef(null);

  const [index, setIndex] = useState(undefined);
  const song = songs[index] ?? { vote: 0 };
  const src = song.url;

  const [rate, setRate] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [triggerVote, setTriggerVote] = useState(true);
  const [countdown, setCountdown] = useState(SUBMIT_DURATION);

  const canBackward = index > 0;
  const canForward = index < songs.length - 1;

  const init = () => {
    stopLast();
    setIndex(undefined);
    setRate(0);
    setCountdown(SUBMIT_DURATION);
    setCanSubmit(false);
    setShowReport(false);
    setTriggerVote(true);
  };

  useEffect(() => {
    init();
  }, [time]);

  useEffect(() => {
    if (src) {
      playerRef.current?.play();
    } else {
      playerRef.current?.stop();
    }
  }, [src]);

  const stopLast = () => {
    if (playerRef.current) {
      playerRef.current.stop();
    }
  };

  const timeListener = (offset) => {
    if (index === undefined) {
      return;
    }

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
    newIndex = parseInt(newIndex);
    const player = playerRef.current;

    if (index === newIndex) {
      player.toggle();
      return index;
    }

    init();
    setIndex(newIndex);
    const newSong = songs[newIndex];

    if (newSong.vote !== 0 || newSong.listened) {
      setCountdown(0);
      setRate(newSong.vote);
      setTriggerVote(false);
    } else {
      setCountdown(SUBMIT_DURATION);
    }
    return newIndex;
  };

  const forward = () => {
    const { skipVoted } = preferences;
    let newIndex = index + 1;
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
    let newIndex = index - 1;
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
      message.warning(`试听时长需达到${SUBMIT_DURATION}秒才能投票`);
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

  const handleRatingChange = (value) => {
    setRate(value);
    setCanSubmit(true);
  };

  const buttonProps = {
    type: song.vote !== 0 ? "default" : "primary",
    shape: !isDesktop ? "circle" : undefined,
    icon: countdown <= 0 ? <CheckOutlined /> : undefined,
    disabled: countdown > 0
  };

  const voteArea = (
    <div className={styles.voteArea} key="vote">
      {countdown <= RATE_DURATION ? (
        <div className={styles.rate}>
          <Rate
            value={rate}
            onChange={handleRatingChange}
            allowClear={false}
            className={styles.rate}
          />
          {rate !== 0 && (
            <div className={classNames("ant-rate-text", styles.voteText)}>
              {voteTexts[rate]}
            </div>
          )}
        </div>
      ) : (
        <span
          className={classNames("ant-rate-text", styles.voteText)}
          style={{ color: "#777" }}
        >
          试听{RATE_DURATION}秒后显示评分栏
        </span>
      )}
      <Button
        loading={vote.isMutating}
        onClick={() => handleVote("manual")}
        {...buttonProps}
      >
        {countdown > 0 ? Math.ceil(countdown) : isDesktop && "投票"}
      </Button>
    </div>
  );

  const listItems = songs
    .map((song, key) => [
      { type: "divider" },
      {
        key,
        label: (
          <span className={styles.listItem}>
            <span>
              <span className={styles.itemIndex}>{key + 1}</span>
              您的评价: {voteTexts[song.vote]}
            </span>
            <Rate value={song.vote} disabled className={styles.listStars} />
          </span>
        )
      }
    ])
    .flat()
    .slice(1);

  return (
    <Spin spinning={voteList.isLoading}>
      {songs.length !== 0 ? (
        <>
          <Card bordered={false} className={styles.card}>
            <div className={styles.player}>
              <Player
                src={src}
                onProgress={timeListener}
                onEnded={onEnded}
                canBackward={canBackward}
                canForward={canForward}
                onBackward={backward}
                onForward={forward}
                ref={playerRef}
              />
              <br />
              <Button
                size="small"
                onClick={() => setShowReport((showReport) => !showReport)}
                disabled={index === undefined}
                className={styles.toggleReport}
              >
                反馈
              </Button>
            </div>
            <br />
            <hr />
            {voteArea}
            <TransitionGroup>
              {showReport && (
                <CSSTransition
                  nodeRef={reportFormRef}
                  classNames="fade"
                  timeout={{ enter: 500, exit: 200 }}
                >
                  <ReportForm
                    ref={reportFormRef}
                    id={song.id}
                    onSubmitted={() => setShowReport(false)}
                  />
                </CSSTransition>
              )}
            </TransitionGroup>
          </Card>
          <Menu
            className={styles.list}
            items={listItems}
            selectedKeys={index === undefined ? [] : [String(index)]}
            onClick={({ key }) => handleSwitch(key)}
            style={{ borderInlineEnd: "none" }}
          />
          <Tips time={time} progress={voteList.progress} />
        </>
      ) : (
        <Empty />
      )}
    </Spin>
  );
};

export default VoteList;
