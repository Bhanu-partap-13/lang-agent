import "dotenv/config";
import postgres from "postgres";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("ERROR: DATABASE_URL environment variable is missing.");
  process.exit(1);
}

const client = postgres(dbUrl);

async function run(sqlStr, args = []) {
  // Convert sqlite "?" placeholders to postgres "$1", "$2" etc.
  let index = 1;
  const pgSql = sqlStr.replace(/\?/g, () => `$${index++}`);
  // In PG, double quotes are used for column names (e.g. "order"). 
  // Let's ensure the query runs correctly.
  await client.unsafe(pgSql, args);
}

// Ensure chest_claimed column exists in daily_activity
try {
  await run(`ALTER TABLE daily_activity ADD COLUMN chest_claimed INTEGER NOT NULL DEFAULT 0`);
} catch {
  // Column already exists or table not created yet
}

// ─── WIPE CONTENT TABLES (keep auth rows intact) ───────────────────────────
console.log("Wiping content tables...");
await run(`DELETE FROM exercise_attempts`);
await run(`DELETE FROM lesson_attempts`);
await run(`DELETE FROM user_skill_progress`);
await run(`DELETE FROM user_stats`);
await run(`DELETE FROM daily_activity`);
await run(`DELETE FROM exercises`);
await run(`DELETE FROM lessons`);
await run(`DELETE FROM skills`);
await run(`DELETE FROM units`);
await run(`DELETE FROM courses`);

// ─── COURSE ────────────────────────────────────────────────────────────────
console.log("Inserting course...");
await run(
  `INSERT INTO courses (id, title, from_language, target_language, icon_url) VALUES (?, ?, ?, ?, ?)`,
  ["course_english", "English", "hi", "en", "/flags/us.svg"]
);

// ─── UNITS ─────────────────────────────────────────────────────────────────
console.log("Inserting units...");
const units = [
  ["unit_1", "course_english", 1, "English Phonics & Basic Determinants", "SECTION 1, UNIT 1", "green"],
];
for (const u of units) {
  await run(`INSERT INTO units (id, course_id, "order", title, description, color_theme) VALUES (?, ?, ?, ?, ?, ?)`, u);
}

// ─── SKILLS ────────────────────────────────────────────────────────────────
console.log("Inserting skills...");
const skills = [
  ["skill_1_1", "unit_1", 1, "Vowels & Phonics", null, 5, "[]"],
  ["skill_1_2", "unit_1", 2, "Basic Grammar & Determinants", null, 5, '["skill_1_1"]'],
];
for (const s of skills) {
  await run(`INSERT INTO skills (id, unit_id, "order", title, icon_url, max_crowns, prerequisite_skill_ids) VALUES (?, ?, ?, ?, ?, ?, ?)`, s);
}

// ─── LESSONS ───────────────────────────────────────────────────────────────
console.log("Inserting lessons...");
const lessons = [
  // Skill 1: Vowels & Phonics
  ["lesson_1", "skill_1_1", 1, "new", 1], // Pronunciation of Vowels
  ["lesson_2", "skill_1_1", 2, "new", 1], // The Umbrella Rule
  // Skill 2: Basic Grammar & Determinants
  ["lesson_3", "skill_1_2", 1, "new", 1], // Possessives & Demonstratives
  ["lesson_4", "skill_1_2", 2, "new", 1], // Quantifiers
];
for (const l of lessons) {
  await run(`INSERT INTO lessons (id, skill_id, "order", type, crown_level) VALUES (?, ?, ?, ?, ?)`, l);
}

// ─── EXERCISES ─────────────────────────────────────────────────────────────
console.log("Inserting exercises...");

// Helper function to stringify JSON fields
const j = (obj) => JSON.stringify(obj);

const exercises = [
  // ==========================================
  // LESSON 1: Pronunciation of Vowels
  // ==========================================
  [
    "ex_1_1", "lesson_1", 1, "multiple_choice",
    "Which word starts with a short vowel sound?",
    j(["Ape", "Apple", "Agent"]), // options
    j("Apple"), // correctAnswer
    null, // pairs
    null, null // audio, image
  ],
  [
    "ex_1_2", "lesson_1", 2, "match_pairs",
    "Match the vowels to the correct starting word:",
    null, // options
    j("all"), // correctAnswer for match_pairs
    j([
      { left: "A", right: "Ant" },
      { left: "E", right: "Egg" },
      { left: "I", right: "Ink" },
      { left: "O", right: "Otter" }
    ]), // pairs
    null, null
  ],
  [
    "ex_1_3", "lesson_1", 3, "fill_blank",
    "The letter 'U' in '_____' sounds like 'yoo'.",
    j(["umbrella", "unicorn"]), // options
    j("unicorn"), // correctAnswer
    null, null, null
  ],

  // ==========================================
  // LESSON 2: The 'Umbrella' Rule
  // ==========================================
  [
    "ex_2_1", "lesson_2", 1, "translate", // we map WORD_BANK to translate type
    "Translate: 'Mujhe ek umbrella chahiye'",
    j(["I", "need", "a", "an", "umbrella", "apple"]), // word bank options
    j("I need an umbrella"), // correct sequence
    null, null, null
  ],
  [
    "ex_2_2", "lesson_2", 2, "fill_blank",
    "She is holding _____ umbrella.",
    j(["a", "an"]),
    j("an"),
    null, null, null
  ],
  [
    "ex_2_3", "lesson_2", 3, "type_answer",
    "Type the correct article: She is studying at (a/an) university.",
    null, // options not needed
    j("a"), // correct answer
    null, null, null
  ],
  [
    "ex_2_4", "lesson_2", 4, "multiple_choice",
    "Choose the correct sentence:",
    j(["It is an hour late.", "It is a hour late."]),
    j("It is an hour late."),
    null, null, null
  ],

  // ==========================================
  // LESSON 3: Possessives & Demonstratives
  // ==========================================
  [
    "ex_3_1", "lesson_3", 1, "multiple_choice",
    "Which is correct for an object far away?",
    j(["This is a car.", "That is a car."]),
    j("That is a car."),
    null, null, null
  ],
  [
    "ex_3_2", "lesson_3", 2, "translate",
    "Translate: 'Yeh meri kitab hai'",
    j(["This", "is", "my", "book", "That", "mine"]),
    j("This is my book"),
    null, null, null
  ],
  [
    "ex_3_3", "lesson_3", 3, "match_pairs",
    "Match Singular to Plural:",
    null,
    j("all"),
    j([
      { left: "This", right: "These" },
      { left: "That", right: "Those" },
      { left: "My", right: "Our" },
      { left: "His", right: "Their" }
    ]),
    null, null
  ],

  // ==========================================
  // LESSON 4: Quantifiers
  // ==========================================
  [
    "ex_4_1", "lesson_4", 1, "fill_blank",
    "I don't have _____ money left.",
    j(["much", "many"]),
    j("much"),
    null, null, null
  ],
  [
    "ex_4_2", "lesson_4", 2, "type_answer",
    "Type the missing word: How (much/many) apples are there?",
    null,
    j("many"),
    null, null, null
  ],
  [
    "ex_4_3", "lesson_4", 3, "translate",
    "Translate: 'Mere paas kuch dost hain'",
    j(["I", "have", "some", "friends", "any", "much"]),
    j("I have some friends"),
    null, null, null
  ]
];

for (const ex of exercises) {
  await run(
    `INSERT INTO exercises (id, lesson_id, "order", type, prompt, options, correct_answer, pairs, audio_url, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ex
  );
}

// ─── USER PROFILE AND STATS (SEED DATA) ────────────────────────────────────
console.log("Setting up mock user...");

// We ensure "seed_user_1" exists in userStats
await run(`DELETE FROM daily_activity WHERE user_id = ?`, ["seed_user_1"]);
await run(`DELETE FROM user_stats WHERE user_id = ?`, ["seed_user_1"]);
await run(
  `INSERT INTO user_stats (user_id, total_xp, current_streak, longest_streak, hearts, max_hearts, gems) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ["seed_user_1", 120, 3, 5, 5, 5, 500]
);

const todayStr = new Date().toISOString().split("T")[0];
await run(
  `INSERT INTO daily_activity (user_id, date, xp_earned, lessons_completed, chest_claimed) VALUES (?, ?, ?, ?, ?)`,
  ["seed_user_1", todayStr, 0, 0, 0]
);

console.log("Database seeded successfully with English Grammar Course!");
await client.end();
