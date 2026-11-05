import {
  awayFromKeyboard,
  caseStudies,
  education,
  experiences,
  featuredProjects,
  journeyStops,
  personalInfo,
  projects,
  publications,
  type JourneyStopId,
} from "@/lib/data";

export type Passage = {
  title: string;
  subtitle: string;
  text: string;
  stopId: JourneyStopId | null;
  href: string;
  source: string;
  current: boolean;
  lead: boolean;
  tokens: string[];
  textTokens: Set<string>;
};

export type AskResult = {
  keywords: string[];
  passagesChecked: number;
  match: Passage | null;
};

const STOPWORDS = new Set(
  "a about all am an and any are as at be been but by can did do does done for from get got had has have how i in into is it its just know like me my naman of on or our over please show so tell than that the their them there they this to tyagi use used using was were what when where which who why will with work worked working would you your".split(
    " ",
  ),
);

// Query words visitors use that the site's text says differently.
const SYNONYMS: Record<string, string[]> = {
  cv: ["computer", "vision"],
  ml: ["machine", "learning"],
  ai: ["artificial", "intelligence"],
  llm: ["llms"],
  study: ["education", "degree"],
  studied: ["education", "degree"],
  college: ["university", "degree"],
  school: ["university", "degree"],
  job: ["engineer", "intern"],
  jobs: ["engineer", "intern"],
  paper: ["publication", "journal"],
  papers: ["publication", "journal"],
  published: ["publication", "journal"],
  publish: ["publication", "journal"],
  publications: ["journal"],
  hobby: ["keyboard"],
  hobbies: ["keyboard"],
  fun: ["keyboard"],
  live: ["home"],
  based: ["home"],
  located: ["home"],
};

const CURRENT_WORDS = new Set(["now", "current", "currently", "today", "present"]);
const BM25_K1 = 1.2;
const BM25_B = 0.25;
const SYNONYM_WEIGHT = 0.6;
const CURRENT_BOOST = 1.5;
const MIN_SCORE = 1.5;
const TEXT_MATCH_BONUS = 0.5;
// A role's first bullet and a write-up's first sentence are its summary.
const LEAD_BONUS = 0.6;
const MIN_KEYWORD_COVERAGE = 0.5;
// Prefer deeper write-ups over one-line index entries when both match.
const SOURCE_WEIGHT: Record<string, number> = { Projects: 0.7 };

function stem(word: string): string {
  for (const suffix of ["ers", "ing", "ed", "er", "es", "s"]) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 4) {
      return word.slice(0, -suffix.length);
    }
  }
  return word;
}

function words(text: string): string[] {
  return (
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .match(/[a-z0-9+#]+/g) ?? []
    ).filter((w) => w.length > 1);
}

const tokenize = (text: string) => words(text).filter((w) => !STOPWORDS.has(w)).map(stem);

const sentences = (text: string) => text.split(/(?<=[.!?])\s+(?=[A-Z])/);

const EXPERIENCE_STOPS: Record<string, JourneyStopId> = {
  "FAMS Lab, NYU Tandon": "newyork",
  "NYU Office of Faculty Affairs": "newyork",
  "Mast-Jägermeister US, Inc.": "newyork",
  "University of Essex": "london",
  Ciena: "noida",
  "Ulavi Technologies PTE. Ltd": "singapore",
};

const EDUCATION_STOPS: Record<string, JourneyStopId> = {
  "NYU Tandon School of Engineering": "newyork",
  "Amity University Noida": "noida",
};

const CASE_STUDY_STOPS: Record<string, JourneyStopId> = {
  "medical-cv": "newyork",
  "faculty-ops": "newyork",
};

type Draft = Omit<Passage, "tokens" | "textTokens"> & { context: string };

function buildDrafts(): Draft[] {
  const drafts: Draft[] = [];

  for (const job of experiences) {
    job.description.forEach((bullet, i) => {
      drafts.push({
        title: job.title,
        subtitle: `${job.company} · ${job.location} · ${job.period}`,
        text: bullet,
        stopId: EXPERIENCE_STOPS[job.company] ?? null,
        href: "/#experience",
        source: "Experience",
        current: job.period.includes("Present"),
        lead: i === 0,
        context: `${job.title} ${job.company} ${job.location} ${job.tags.join(" ")}`,
      });
    });
  }

  // `education` is newest first, so the latest degree leads.
  education.forEach((school, i) => {
    drafts.push({
      title: school.degree,
      subtitle: `${school.school} · ${school.location} · ${school.period}`,
      text: `${school.degree} at ${school.school}.${school.details ? ` ${school.details}.` : ""}`,
      stopId: EDUCATION_STOPS[school.school] ?? null,
      href: "/#about",
      source: "About",
      current: false,
      lead: i === 0,
      context: `education degree university ${school.degree} ${school.school} ${school.location} ${(school.courses ?? []).join(" ")}`,
    });
  });

  for (const stop of journeyStops) {
    for (const entry of stop.entries) {
      if (entry.title !== "Exchange program") continue;
      drafts.push({
        title: entry.title,
        subtitle: `${entry.org} · ${entry.period}`,
        text: `Undergraduate exchange at ${entry.org}, during the B.Tech.`,
        stopId: stop.id,
        href: "/#about",
        source: "About",
        current: false,
        lead: false,
        context: `exchange abroad ${stop.city} ${entry.org}`,
      });
    }
  }

  for (const study of caseStudies) {
    sentences(study.description).forEach((sentence, i) => {
      drafts.push({
        title: study.title,
        subtitle: `${study.category} · ${study.year}`,
        text: sentence,
        stopId: CASE_STUDY_STOPS[study.slug] ?? null,
        href: `/work/${study.slug}`,
        source: "Case study",
        current: false,
        lead: i === 0,
        context: `${study.title} ${study.category} ${study.stack.join(" ")}`,
      });
    });
  }

  for (const project of featuredProjects) {
    sentences(project.summary).forEach((sentence, i) => {
      drafts.push({
        title: project.title,
        subtitle: `${project.category} · ${project.date}`,
        text: sentence,
        stopId: null,
        href: "/#work",
        source: "Selected work",
        current: false,
        lead: i === 0,
        context: `project built ${project.title} ${project.category} ${project.stack.join(" ")}`,
      });
    });
  }

  for (const project of projects) {
    sentences(project.description).forEach((sentence, i) => {
      drafts.push({
        title: project.title,
        subtitle: project.tags.slice(0, 3).join(" · "),
        text: sentence,
        stopId: null,
        href: project.caseStudy ?? "/#work",
        source: "Projects",
        current: false,
        lead: i === 0,
        context: `project built ${project.title} ${project.tags.join(" ")}`,
      });
    });
  }

  for (const publication of publications) {
    drafts.push({
      title: publication.title,
      subtitle: `${publication.publisher} · ${publication.date}`,
      text: sentences(publication.description)[0],
      stopId: null,
      href: "/#research",
      source: "Research",
      current: false,
      lead: false,
      context: `publication paper publish ${publication.type} ${publication.title} ${publication.publisher}`,
    });
  }

  drafts.push({
    title: "Away from the keyboard",
    subtitle: "About",
    text: awayFromKeyboard,
    stopId: null,
    href: "/#about",
    source: "About",
    current: false,
    lead: false,
    context: "keyboard interests free time",
  });

  drafts.push({
    title: "Home base",
    subtitle: personalInfo.location,
    text: `Based in ${personalInfo.location}.`,
    stopId: "newyork",
    href: "/#about",
    source: "About",
    current: true,
    lead: false,
    context: "home location city",
  });

  return drafts;
}

const PASSAGES: Passage[] = buildDrafts().map(({ context, ...draft }) => ({
  ...draft,
  tokens: tokenize(`${draft.title} ${draft.text} ${context}`),
  textTokens: new Set(tokenize(draft.text)),
}));

const AVERAGE_LENGTH = PASSAGES.reduce((sum, p) => sum + p.tokens.length, 0) / PASSAGES.length;

const DOCUMENT_FREQUENCY = PASSAGES.reduce((counts, passage) => {
  for (const token of new Set(passage.tokens)) counts.set(token, (counts.get(token) ?? 0) + 1);
  return counts;
}, new Map<string, number>());

function termScore(passage: Passage, term: string): number {
  const frequency = passage.tokens.filter((t) => t === term).length;
  if (frequency === 0) return 0;
  const df = DOCUMENT_FREQUENCY.get(term) ?? 0;
  const idf = Math.log(1 + (PASSAGES.length - df + 0.5) / (df + 0.5));
  const norm = BM25_K1 * (1 - BM25_B + (BM25_B * passage.tokens.length) / AVERAGE_LENGTH);
  return (idf * frequency * (BM25_K1 + 1)) / (frequency + norm);
}

export function askMap(question: string): AskResult {
  const raw = words(question);
  const keywords = raw.filter((w) => !STOPWORDS.has(w) && !CURRENT_WORDS.has(w));
  const wantsCurrent = raw.some((w) => CURRENT_WORDS.has(w));

  const terms = new Map<string, number>();
  for (const keyword of keywords) {
    terms.set(stem(keyword), 1);
    for (const synonym of SYNONYMS[keyword] ?? []) {
      const term = stem(synonym);
      if (!terms.has(term)) terms.set(term, SYNONYM_WEIGHT);
    }
  }

  let match: Passage | null = null;
  let best = 0;
  if (terms.size > 0 || wantsCurrent) {
    for (const passage of PASSAGES) {
      let score = 0;
      for (const [term, weight] of terms) {
        const termValue = termScore(passage, term) * weight;
        score += termValue;
        if (termValue > 0 && passage.textTokens.has(term)) score += TEXT_MATCH_BONUS * weight;
      }
      score *= SOURCE_WEIGHT[passage.source] ?? 1;
      if (score > 0 && passage.lead) score += LEAD_BONUS;
      if (wantsCurrent && passage.current) score += CURRENT_BOOST;
      if (score > best) {
        best = score;
        match = passage;
      }
    }
  }

  const found = match as Passage | null;
  const covered = found
    ? keywords.filter((k) =>
        [k, ...(SYNONYMS[k] ?? [])].some((w) => found.tokens.includes(stem(w))),
      ).length
    : 0;
  const enoughCoverage = keywords.length === 0 || covered / keywords.length >= MIN_KEYWORD_COVERAGE;

  return {
    keywords,
    passagesChecked: PASSAGES.length,
    match: best >= MIN_SCORE && enoughCoverage ? found : null,
  };
}
