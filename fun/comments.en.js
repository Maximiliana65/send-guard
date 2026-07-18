// fun/comments.en.js
//
// English version of the fun comments. Same rules as the Japanese file:
//   { text: "...", emoji: "..." }
//   rare: true          -> shows up much less often
//   season: {from, to}  -> only shows during that date range ("MM-DD"),
//                          wrap-around ranges (e.g. New Year) are supported
//
// Which language is shown is decided automatically by fun/fun-engine.js
// based on the browser's UI language.

window.SendGuardComments = window.SendGuardComments || {};

window.SendGuardComments.en = [
  // ===== Common =====
  { text: "Nailed it!", emoji: "🐧" },
  { text: "Boom!", emoji: "🐋" },
  { text: "Nice!", emoji: "✨" },
  { text: "Sent!", emoji: "📮" },
  { text: "Awesome!", emoji: "👍" },

  { text: "Off you go!", emoji: "🚀" },
  { text: "Go for it!", emoji: "🚀" },
  { text: "Go!", emoji: "🚦" },
  { text: "GO!", emoji: "🏁" },

  { text: "Click!", emoji: "🖱️" },
  { text: "Tap!", emoji: "🔘" },

  { text: "Let's go!", emoji: "💪" },
  { text: "Yes!", emoji: "🔥" },

  { text: "Woohoo!", emoji: "🐣" },
  { text: "Hooray!", emoji: "🙌" },
  { text: "Nice send!", emoji: "🙌" },

  { text: "Perfect!", emoji: "👌" },
  { text: "Cool!", emoji: "😎" },
  { text: "All good!", emoji: "🐾" },

  { text: "Smooth!", emoji: "🦦" },
  { text: "Slick!", emoji: "🦭" },

  { text: "Whoosh!", emoji: "💨" },
  { text: "Zoom!", emoji: "💨" },

  { text: "Ping!", emoji: "💡" },
  { text: "Smile!", emoji: "😊" },

  { text: "Done!", emoji: "✅" },
  { text: "Success!", emoji: "🧩" },
  { text: "Bullseye!", emoji: "🎯" },
  { text: "Strike!", emoji: "🎳" },

  { text: "Well done!", emoji: "☕" },
  { text: "Take a break!", emoji: "🍵" },

  { text: "Looking good!", emoji: "🌸" },
  { text: "You got it!", emoji: "🎈" },
  { text: "Yay!", emoji: "🎊" },

  { text: "There!", emoji: "🦊" },
  { text: "Hi-ya!", emoji: "🐢" },

  { text: "Fired!", emoji: "🏹" },
  { text: "Flying!", emoji: "🦅" },

  { text: "Floating...", emoji: "🐳" },
  { text: "Waddle waddle", emoji: "🐥" },
  { text: "Munch munch", emoji: "🐹" },
  { text: "Hop!", emoji: "🐰" },
  { text: "Roll!", emoji: "🦔" },
  { text: "Splash!", emoji: "🐟" },
  { text: "Slow and steady", emoji: "🐢" },
  { text: "Flap flap", emoji: "🦆" },
  { text: "Flutter!", emoji: "🦋" },
  { text: "Feeling good!", emoji: "🐼" },

  { text: "Delivered!", emoji: "📦" },
  { text: "Roger!", emoji: "🫡" },
  { text: "On it!", emoji: "🫡" },

  { text: "Waiting...", emoji: "⏳" },
  { text: "To cyberspace!", emoji: "🌐" },
  { text: "Your turn!", emoji: "🏃" },

  { text: "Sending thoughts...", emoji: "🧠" },
  { text: "What's next?", emoji: "💬" },

  { text: "To the AI!", emoji: "💌" },
  { text: "Here it goes!", emoji: "💌" },

  { text: "Snap!", emoji: "📸" },
  { text: "Ready?", emoji: "🎬" },

  { text: "Boom!", emoji: "💥" },
  { text: "Here you go!", emoji: "💁" },

  { text: "All clear!", emoji: "👷" },
  { text: "Mission complete!", emoji: "🛰️" },

  { text: "Safe!", emoji: "😌" },
  { text: "Looking good!", emoji: "🧐" },
  { text: "Unlocked!", emoji: "🔓" },
  { text: "Send away!", emoji: "📨" },
  { text: "Seen!", emoji: "👀" },
  { text: "One shot!", emoji: "🎯" },
  { text: "Safe send!", emoji: "🛡️" },
  { text: "Enter unlocked!", emoji: "🗝️" },

  // ===== Rare =====
  { text: "Jackpot!", emoji: "🎯", rare: true },

  { text: "SSR!", emoji: "🌈", rare: true },
  { text: "Legendary Send!", emoji: "🐉", rare: true },
  { text: "Legendary Enter!", emoji: "👑", rare: true },

  { text: "God-tier!", emoji: "⚡", rare: true },
  { text: "Perfect timing!", emoji: "⚡", rare: true },
  { text: "Divine!", emoji: "⛩️", rare: true },

  { text: "Super Lucky!", emoji: "🌟", rare: true },
  { text: "Lucky Day!", emoji: "🍀", rare: true },

  { text: "Critical Hit!", emoji: "⚔️", rare: true },
  { text: "Secret Move!", emoji: "🎮", rare: true },

  { text: "To infinity!", emoji: "🌌", rare: true },
  { text: "AI Approved!", emoji: "🤖", rare: true },

  { text: "Perfect!", emoji: "💎", rare: true },
  { text: "Winner!", emoji: "🎉", rare: true },
  { text: "Miracle!", emoji: "🦄", rare: true },
  { text: "Bonus!", emoji: "🍰", rare: true },

  { text: "100%!", emoji: "💯", rare: true },

  { text: "Zero Misfires!", emoji: "🏆", rare: true },
  { text: "Accident-free!", emoji: "🚧", rare: true },
  { text: "Super Safe!", emoji: "🛡️", rare: true },
  { text: "Combo!", emoji: "🔥", rare: true },
  { text: "Lucky Send!", emoji: "🎁", rare: true },

  // ===== Seasonal =====
  { text: "Merry Christmas!", emoji: "🎄", season: { from: "12-20", to: "12-25" } },
  { text: "Santa Express!", emoji: "🎅", season: { from: "12-20", to: "12-25" } },
  { text: "Happy New Year!", emoji: "🎍", season: { from: "01-01", to: "01-03" } },
  { text: "Let's rock this year!", emoji: "🐉", season: { from: "01-01", to: "01-03" } },
  { text: "Trick or Treat!", emoji: "🎃", season: { from: "10-25", to: "10-31" } },
  { text: "Ghost Mail!", emoji: "👻", season: { from: "10-25", to: "10-31" } }
];
