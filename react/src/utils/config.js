export const api = {
  status: "/status",
  login: "/auth/login",
  logout: "/auth/logout",
  list: "/vote/list",
  report: "/report",
  vote: "/vote",
  search: "/music/search",
  mp3: "/music/mp3",
  upload: "/upload",
  uploads: "/uploads",
};

export const voteTexts = [
  "未投票",
  "非常不合适",
  "不合适",
  "中立",
  "合适",
  "非常合适",
];

export const timeIdToText = {
  1: "6:40",
  2: "7:10",
  3: "13:45",
  4: "18:10",
  5: "21:55",
  6: "22:40",
};

export const timeIdToName = {
  1: "起床铃",
  2: "早出门",
  3: "午出门",
  4: "晚出门",
  5: "晚自习结束",
  6: "熄灯铃",
};

export const timeFilters = Object.entries(timeIdToText).map(([key, value]) => ({
  text: value,
  value: key,
}));
