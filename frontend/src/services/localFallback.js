const LOCAL_FAQ = [
  {
    keywords: ['sky', 'blue', 'sunlight'],
    reply:
      "Sunlight has many colours. Air scatters blue light more, so the sky usually looks blue!",
  },
  {
    keywords: ['dinosaur', 'dinosaurs'],
    reply:
      "Dinosaurs like T. rex are extinct. But modern birds evolved from a group of dinosaurs!",
  },
  {
    keywords: ['plant', 'plants', 'grow'],
    reply:
      "Plants need sunlight, water, air, and nutrients to grow big and strong.",
  },
  {
    keywords: ['math', 'maths', 'addition', 'subtraction', 'multiply'],
    reply:
      "I can help with maths! Try asking me something like: what is 7 plus 5?",
  },
  {
    keywords: ['story', 'stories'],
    reply:
      "I can tell you stories! Would you like to hear about a brave little rabbit or a curious star?",
  },
  {
    keywords: ['hello', 'hi', 'hey', 'namaste'],
    reply:
      "Hello! I'm StudIQ, your AI learning buddy. What would you like to learn today?",
  },
];

const SAFE_FALLBACKS = [
  "I'm having a little trouble thinking right now. Chalo, try a maths question or a fun science fact!",
  "My smart chat is taking a break. Would you like to try a quiz or read a story instead?",
  "I can't connect to my brain just now. Let's play a local learning game together!",
];

export function getLocalReply(message) {
  const lower = message.toLowerCase();
  for (const item of LOCAL_FAQ) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.reply;
    }
  }
  return SAFE_FALLBACKS[Math.floor(Math.random() * SAFE_FALLBACKS.length)];
}