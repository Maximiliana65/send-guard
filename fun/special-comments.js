// fun/special-comments.js
//
// 「何回目の送信か」「今何時か」によって表示される、特別な一言コメントです。
// fun/comments.ja.js / comments.en.js のランダムなコメントより優先して表示されます。
//
// - first      … 生まれて初めての送信(累計1回目)
// - milestones … 累計の回数がキーと一致した時だけ表示(10, 50, 100回目など)
// - lateNight  … 深夜0時〜4時に送信した時に表示
//
// milestonesにキーを追加すれば、200回目・500回目なども自由に増やせます。
// 例: milestones: { 10: {...}, 50: {...}, 100: {...}, 200: {...} }

window.SendGuardSpecialComments = {
  ja: {
    first: { text: "はじめまして", emoji: "🍓" },
    milestones: {
      10: { text: "10連達成!", emoji: "🔥" },
      50: { text: "50連!絶好調", emoji: "🌟" },
      100: { text: "守護神!", emoji: "🧙" }
    },
    lateNight: { text: "夜更かしさん?", emoji: "🌛" }
  },
  en: {
    first: { text: "Nice to meet you!", emoji: "🍓" },
    milestones: {
      10: { text: "10 in a row!", emoji: "🔥" },
      50: { text: "50 sends, on a roll!", emoji: "🌟" },
      100: { text: "Guardian unlocked!", emoji: "🧙" }
    },
    lateNight: { text: "Up late?", emoji: "🌛" }
  }
};
