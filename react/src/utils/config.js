module.exports = {
  api: {
    status: "/status",
    login: "/login",
    logout: "/logout",
    list: "/vote/list",
    report: "/report",
    vote: "/vote",
    search: "/music/search",
    mp3: "/music/mp3",
    upload: "/upload",
    uploads: "/uploads"
  },
  voteTexts: ["未投票", "非常不合适", "不合适", "中立", "合适", "非常合适"],
  timeIdToText: {
    "1": "6:30",
    "2": "7:00",
    "3": "13:45",
    "4": "18:40",
    "5": "21:35",
    "6": "22:30"
  },
  timeFilters: [
    { text: "6:30", value: "1" },
    { text: "7:00", value: "2" },
    { text: "13:45", value: "3" },
    { text: "18:40", value: "4" },
    { text: "21:35", value: "5" },
    { text: "22:30", value: "6" }
  ]
};
