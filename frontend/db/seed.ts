import { config } from "dotenv";

// Must run before ./index is evaluated, so the db client sees DATABASE_URL.
// Static imports are hoisted, hence the dynamic import inside main().
config({ path: ".env.local" });
config({ path: ".env" });

/**
 * Prompts spanning the ranges the README names: technology, AI, politics,
 * economics, society, philosophy, education, environment, current affairs,
 * everyday life, hypotheticals, controversial questions and abstract ideas.
 *
 * They are stored as plain prompts — V1 has no categories or difficulty levels.
 */
const PROMPTS = [
  // Technology & AI
  "Should AI-generated content be regulated?",
  "Will artificial intelligence make humans less creative?",
  "Does everyone need to learn how to code, or is that advice already outdated?",
  "Should social media platforms be legally responsible for what users post?",
  "Has the smartphone made us better informed or just better distracted?",
  "Is it reasonable to expect privacy online in 2026?",
  "Should there be an age limit for social media accounts?",
  "What happens when a technology built to save time creates more work instead?",
  "Would you trust an algorithm to make a medical decision about you?",
  "Should companies be required to disclose when you are talking to an AI?",

  // Politics & current affairs
  "Should voting be compulsory?",
  "Is democracy the best system of government we have found so far?",
  "Should there be a maximum age for holding political office?",
  "Do international sanctions actually work?",
  "Should countries be allowed to restrict who enters them?",
  "Is protest still an effective way to create political change?",

  // Economics
  "Should nuclear energy replace coal?",
  "Would a universal basic income help or harm society?",
  "Is economic growth still a useful measure of a country's success?",
  "Should there be a maximum wage as well as a minimum wage?",
  "Do cashless societies benefit everyone equally?",
  "Is owning a home still a realistic goal for your generation?",

  // Society
  "Has remote work been good for society?",
  "Should the four-day work week become standard?",
  "Are cities designed for people or for cars?",
  "Is loneliness a public health problem or a personal one?",
  "Should public transport be free?",
  "Does celebrity culture do more harm than good?",
  "Has the internet made us more tolerant or more divided?",

  // Philosophy & abstract ideas
  "Is it possible to be truly objective about anything?",
  "Does free will exist, or does it just feel like it does?",
  "What does it actually mean to live a good life?",
  "Is failure necessary in order to grow?",
  "Should we value happiness more than meaning?",
  "Is boredom useful?",
  "Does language shape the way we think, or only how we describe thinking?",
  "Is there such a thing as an original idea?",

  // Education
  "Should exams be abolished?",
  "Is a university degree still worth the cost?",
  "Should schools teach personal finance instead of some traditional subjects?",
  "Does homework actually improve learning?",
  "Should students be allowed to use AI tools in their coursework?",

  // Environment
  "Is individual action meaningful in addressing climate change?",
  "Should single-use plastics be banned outright?",
  "Do we have an obligation to future generations we will never meet?",
  "Should wealthy countries pay more toward climate costs than poorer ones?",
  "Is space exploration a good use of money while problems remain on Earth?",

  // Everyday life
  "Is being busy the same as being productive?",
  "Should tipping be replaced by higher wages?",
  "Do you learn more from people who agree with you or disagree with you?",
  "Is it better to be respected or to be liked?",
  "Has convenience made our lives better?",
  "What is something most people believe that you quietly disagree with?",

  // Hypotheticals
  "How would a city function if cars disappeared for forty-eight hours?",
  "What would change if everyone knew exactly how long they would live?",
  "If you could add one subject to every school curriculum worldwide, what would it be?",
  "What would society look like if we all worked half as many hours?",
  "If you had to remove one invention from history, which would it be?",
  "What would happen if every city banned digital advertising for one month?",

  // Controversial
  "Should billionaires exist?",
  "Is cancel culture accountability or mob justice?",
  "Should animal testing be permitted for medical research?",
  "Is patriotism a virtue or a limitation?",
  "Should the wealthy be taxed significantly more?",
] as const;

async function main() {
  const { db } = await import("./index");
  const { topics } = await import("./schema");

  const rows = PROMPTS.map((prompt) => ({ prompt }));

  const inserted = await db
    .insert(topics)
    .values(rows)
    .onConflictDoNothing({ target: topics.prompt })
    .returning({ id: topics.id });

  console.log(
    `Seeded ${inserted.length} new topic(s); ${PROMPTS.length - inserted.length} already present.`,
  );
  process.exit(0);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
