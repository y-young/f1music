import { BottomTips } from "components";
import { memo } from "react";
import { Link } from "react-router-dom";

const Tips = ({ progress, time }) => {
  const [voted, total] = progress;

  if (voted < total) {
    return (
      <BottomTips>
        本时段您已投 {voted} 首曲目，还有 {total - voted} 首未投票曲目
      </BottomTips>
    );
  }

  let rndTime;
  do {
    rndTime = Math.floor(Math.random() * 5 + 1);
  } while (rndTime === time);

  return (
    <BottomTips>
      您已投完本时段所有曲目，到
      <Link to={"/vote/" + rndTime}>其他时段</Link>
      看看吧
    </BottomTips>
  );
};

export default memo(Tips);
