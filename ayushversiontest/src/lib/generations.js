// Two versions of the "three generations" narrative. The toggle in
// Generations.jsx swaps between them. Each is 5 beats:
// problem -> gen 1 -> gen 2 (tags) -> gen 3 (collapse) -> payoff.

export const versionA = {
  name: "By language",
  beats: [
    {
      kind: "problem",
      label: "The problem",
      headline: "There's a problem with how we build software.",
      body: "It's not that any one language is bad. It's that you need five of them to ship one app.",
    },
    {
      kind: "gen",
      label: "Gen 1 · the metal",
      headline: "One language, talking straight to the machine.",
      body: "Assembly, then C. Total control, total pain. You managed memory by hand and one typo took the whole thing down. Fast, but brutal. Nothing came for free.",
    },
    {
      kind: "gen",
      label: "Gen 2 · today",
      headline: "One app. Five languages. A pile of glue.",
      body: "Python out back, JavaScript out front, HTML and CSS for the looks, SQL for the data, and lately a tangle of prompts bolted on for the AI. Five languages, three codebases, half your time spent wiring them together.",
      tags: ["Python", "JavaScript", "HTML", "CSS", "SQL", "AI glue"],
    },
    {
      kind: "gen",
      label: "Gen 3 · Jac",
      headline: "One language. The whole thing.",
      body: "Backend, frontend, data, and AI, all in Jac. The five collapse back into one, without losing the speed or the libraries you already use.",
      collapse: true,
    },
    {
      kind: "payoff",
      label: "Jac",
      headline: "We went back to one language. We just didn't go back in time.",
      body: "Keep scrolling to see how it works.",
    },
  ],
};

export const versionB = {
  name: "By reach",
  beats: [
    {
      kind: "problem",
      label: "The problem",
      headline: "There's a problem with how we build software.",
      body: "Every era fixed the last one's mess and quietly made a new one.",
    },
    {
      kind: "gen",
      label: "Gen 1 · one machine",
      headline: "One language, but it could barely reach anything.",
      body: "Back then one program ran on one machine, in one place. Easy to reason about, but it couldn't touch a browser, a phone, or a model. The world your code could reach was tiny.",
    },
    {
      kind: "gen",
      label: "Gen 2 · the web era",
      headline: "Apps grew up. So did the language count.",
      body: "An app became a backend, a frontend, a database, and now an AI layer, and the answer was a different language for each. Python, JavaScript, HTML, CSS, SQL, plus prompts for the model. More reach, way more moving parts.",
      tags: ["Python", "JavaScript", "HTML", "CSS", "SQL", "AI glue"],
    },
    {
      kind: "gen",
      label: "Gen 3 · Jac",
      headline: "One language that reaches everything.",
      body: "Jac does every layer at once (backend, frontend, data, AI) and still reaches the browser, the cloud, and the model. One again. None of the old limits.",
      collapse: true,
    },
    {
      kind: "payoff",
      label: "Jac",
      headline: "One language. All the reach. None of the glue.",
      body: "Keep scrolling to see how it works.",
    },
  ],
};

export const versions = { A: versionA, B: versionB };
