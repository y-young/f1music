import { useEffect, useRef, useState } from "react";
import { Button, Card, Empty, Menu, Rate, Spin, message } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { voteTexts } from "config";
import useIsDesktop from "hooks/useIsDesktop";
import useVotePreferences from "hooks/useVotePreferences";
import { useVote, useVoteList } from "services/vote";
import classNames from "classnames";

import Player from "../Player";

import styles from "./index.module.less";
import Tips from "./Tips";

import { ReportForm } from "components";

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
  const [showReport, setShowReport] = useState(false);
  const [triggerVote, setTriggerVote] = useState(true);
  const [countdown, setCountdown] = useState(SUBMIT_DURATION);

  const canBackward = index > 0;
  const canForward = index < songs.length - 1;

  const stopLast = () => {
    if (playerRef.current) {
      playerRef.current.stop();
    }
  };

  const init = () => {
    stopLast();
    setIndex(undefined);
    setRate(0);
    setCountdown(SUBMIT_DURATION);
    setShowReport(false);
    setTriggerVote(true);
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  useEffect(() => {
    if (src) {
      playerRef.current?.play();
    } else {
      playerRef.current?.stop();
    }
  }, [src]);

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

  const navigate = (delta) => {
    const { skipVoted } = preferences;
    let newIndex = index + delta;
    if (skipVoted) {
      while (songs[newIndex] && songs[newIndex].vote !== 0) {
        newIndex += delta;
      }
    }
    if (songs[newIndex]) {
      handleSwitch(newIndex);
    } else if (skipVoted) {
      message.info("您已选择跳过已投票歌曲，如无需要请修改偏好设置");
    }
  };
  const forward = () => navigate(1);
  const backward = () => navigate(-1);

  const checkValidity = () => {
    if (countdown > 0) {
      message.warning(`试听时长需达到${SUBMIT_DURATION}秒才能投票`);
      const player = playerRef.current;
      player.audio.currentTime = 0;
      player.play();
      return "time";
    }
    if (rate === 0) {
      message.info("选择评价后即可提交");
      return "rate";
    }
    return "valid";
  };

  // TODO
  async function handleVote(event) {
    const { onSubmitted } = preferences;
    const validity = checkValidity();
    if (validity !== "valid") {
      return;
    }
    const id = song.id;
    await vote
      .trigger({ id, vote: rate })
      .then(() => {
        message.success("投票成功");
        voteList.updateVote(id, rate);
        // Is manual submit
        if (event && onSubmitted === "forward") {
          forward();
        }
      })
      .catch(() => {});
  }

  const onEnded = async () => {
    const { onEnded } = preferences;
    if (song.vote !== 0) {
      forward();
      return;
    }
    const validity = checkValidity();
    if (validity === "valid") {
      await handleVote().then(() => forward());
    } else if (validity === "rate" && onEnded === "forward") {
      forward();
    }
  };

  const buttonProps = {
    type: song.vote === 0 ? "primary" : "default",
    shape: isDesktop ? undefined : "circle",
    icon: countdown <= 0 ? <CheckOutlined /> : undefined,
    disabled: countdown > 0,
  };

  const voteArea = (
    <div key="vote" className={styles.voteArea}>
      {countdown <= RATE_DURATION ? (
        <div className={styles.rate}>
          <Rate
            value={rate}
            allowClear={false}
            className={styles.rate}
            onChange={setRate}
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
      <Button loading={vote.isMutating} onClick={handleVote} {...buttonProps}>
        {countdown > 0 ? Math.ceil(countdown) : isDesktop && "投票"}
      </Button>
    </div>
  );

  const listItems = songs
    .flatMap((song, key) => [
      { type: "divider" },
      {
        key,
        label: (
          <span className={styles.listItem}>
            <span>
              <span className={styles.itemIndex}>{key + 1}</span>
              您的评价: {voteTexts[song.vote]}
            </span>
            <Rate disabled value={song.vote} className={styles.listStars} />
          </span>
        ),
      },
    ])
    .slice(1);

  return (
    <Spin spinning={voteList.isLoading}>
      {songs.length > 0 ? (
        <>
          <Card bordered={false} className={styles.card}>
            <div className={styles.player}>
              <Player
                ref={playerRef}
                src={src}
                canBackward={canBackward}
                canForward={canForward}
                onProgress={timeListener}
                onEnded={onEnded}
                onBackward={backward}
                onForward={forward}
              />
              <br />
              <Button
                size="small"
                disabled={index === undefined}
                className={styles.toggleReport}
                onClick={() => setShowReport((showReport) => !showReport)}
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
            style={{ borderInlineEnd: "none" }}
            onClick={({ key }) => handleSwitch(key)}
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
