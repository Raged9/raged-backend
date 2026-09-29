import fs from "fs";
import path from "path";
import { ProjectItem, TypingScoreItem, ContactMessage } from "../types";

const DATA_DIR = path.resolve(__dirname, "../../data");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface DatabaseSchema {
  projects: ProjectItem[];
  scores: TypingScoreItem[];
  messages: ContactMessage[];
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "ten-thirty-solutions-cms",
    title: "Ten Thirty Solutions CMS",
    subtitle: "Modular full-stack content management system",
    description:
      "A tailored full-stack CMS engineered for scalable digital content workflows with dynamic schema, fast API responses, and role-based permissions.",
    tags: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    techStack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://tenthirty.example.com",
    projectUrl: "https://tenthirty.example.com",
    githubUrl: "https://github.com/Raged9/ten-thirty-solutions",
    year: "2024",
    featured: true,
    order: 1,
    caseStudy: {
      challenge:
        "Traditional CMS platforms were either too rigid for custom editorial workflows or overly bloated, causing unnecessary latency on content-heavy storefronts.",
      solution:
        "Architected a decoupled headless architecture with responsive REST endpoints, optimistic client-side updates, and granular RBAC controls.",
      techStack: [
        "Next.js App Router",
        "TypeScript",
        "Tailwind CSS",
        "Express / Node.js",
        "PostgreSQL",
        "Prisma",
      ],
      lessons:
        "Deepened expertise in database indexing strategies, schema migrations, and designing intuitive dashboard UX for non-technical editors.",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "type-o-matic",
    title: "Type-O-Matic",
    subtitle: "Vintage typewriter typing practice & speed test",
    description:
      "An interactive tactile typing application inspired by mechanical typewriters, featuring real-time WPM analytics and audio-haptic feedback.",
    tags: ["React", "TypeScript", "Motion", "Web Audio API", "Tailwind CSS"],
    techStack: ["React", "TypeScript", "Motion", "Web Audio API", "Tailwind CSS"],
    liveUrl: "https://type-o-matic.example.com",
    projectUrl: "https://type-o-matic.example.com",
    githubUrl: "https://github.com/Raged9/type-o-matic",
    year: "2024",
    featured: true,
    order: 2,
    caseStudy: {
      challenge:
        "Replicating the authentic tactile feel, key-press physics, and low-latency audio response of a vintage typewriter in the browser across diverse devices.",
      solution:
        "Implemented custom keyboard event listeners with sub-millisecond audio buffers using Web Audio API and spring physics via Motion for key depression simulation.",
      techStack: [
        "React",
        "TypeScript",
        "Web Audio API",
        "Motion",
        "Tailwind CSS",
      ],
      lessons:
        "Mastered low-latency web audio synthesis, keyboard event capture nuances, and state batching during ultra-high-speed typing inputs.",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "nlp-cafe-recommendation",
    title: "Cafe Recommendation NLP",
    subtitle: "Semantic text analysis & review-based recommendation engine",
    description:
      "A natural language processing system that analyzes Google Maps review sentiments and extracts cafe ambience profiles to recommend ideal study spots.",
    tags: ["Python", "NLP", "FastAPI", "Cosine Similarity", "TF-IDF", "React"],
    techStack: ["Python", "NLP", "FastAPI", "Cosine Similarity", "TF-IDF", "React"],
    liveUrl: "https://cafe-rec.example.com",
    projectUrl: "https://cafe-rec.example.com",
    githubUrl: "https://github.com/Raged9/nlp-cafe-recommendation",
    year: "2024",
    featured: false,
    order: 3,
    caseStudy: {
      challenge:
        "User reviews are noisy, informal, and mixed with irrelevant commentary, making standard keyword search ineffective for nuanced preferences like 'quiet ambience with strong espresso'.",
      solution:
        "Applied advanced text preprocessing (lemmatization, slang normalization) combined with TF-IDF vectorization and cosine similarity scoring against user query intents.",
      techStack: [
        "Python",
        "Scikit-Learn",
        "FastAPI",
        "Pandas",
        "Next.js",
        "Tailwind CSS",
      ],
      lessons:
        "Learned the subtleties of Indonesian slang text processing, feature weighting in NLP pipelines, and optimizing recommendation inference latency.",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_SCORES: TypingScoreItem[] = [
  { id: "score-1", playerName: "Raged", wpm: 112, accuracy: 99.4, createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "score-2", playerName: "VibeRider", wpm: 98, accuracy: 98.1, createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: "score-3", playerName: "RetroKey", wpm: 87, accuracy: 97.5, createdAt: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: "score-4", playerName: "MechanicalFox", wpm: 76, accuracy: 96.0, createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: "score-5", playerName: "SpeedDaemon", wpm: 68, accuracy: 94.2, createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
];

class DataStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        // Normalize projects to always have tags
        if (Array.isArray(parsed.projects)) {
          parsed.projects = parsed.projects.map((p: any) => ({
            ...p,
            tags: p.tags || p.techStack || [],
            techStack: p.techStack || p.tags || [],
          }));
        }
        return parsed;
      }
    } catch (err) {
      console.error("[DataStore] Failed to load db.json, using defaults:", err);
    }
    const initial: DatabaseSchema = {
      projects: DEFAULT_PROJECTS,
      scores: DEFAULT_SCORES,
      messages: [],
    };
    this.persist(initial);
    return initial;
  }

  private persist(schema?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(schema || this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("[DataStore] Failed to write db.json:", err);
    }
  }

  // Projects CRUD
  getProjects(): ProjectItem[] {
    return [...this.data.projects]
      .map((p) => ({
        ...p,
        tags: p.tags || p.techStack || [],
        techStack: p.techStack || p.tags || [],
      }))
      .sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  getProjectById(id: string): ProjectItem | undefined {
    return this.data.projects.find((p) => p.id === id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === id);
  }

  createProject(item: Omit<ProjectItem, "id" | "createdAt" | "updatedAt">): ProjectItem {
    const tags = item.tags || item.techStack || [];
    const newProject: ProjectItem = {
      ...item,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      tags,
      techStack: tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.projects.push(newProject);
    this.persist();
    return newProject;
  }

  updateProject(id: string, updates: Partial<ProjectItem>): ProjectItem | null {
    const idx = this.data.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const tags = updates.tags || updates.techStack || this.data.projects[idx].tags || [];
    const updated: ProjectItem = {
      ...this.data.projects[idx],
      ...updates,
      tags,
      techStack: tags,
      updatedAt: new Date().toISOString(),
    };
    this.data.projects[idx] = updated;
    this.persist();
    return updated;
  }

  deleteProject(id: string): boolean {
    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    const deleted = this.data.projects.length < initialLen;
    if (deleted) this.persist();
    return deleted;
  }

  // Scores CRUD
  getLeaderboard(limit = 10): TypingScoreItem[] {
    return [...this.data.scores]
      .sort((a, b) => {
        if (b.wpm !== a.wpm) return b.wpm - a.wpm;
        return b.accuracy - a.accuracy;
      })
      .slice(0, limit);
  }

  addScore(score: Omit<TypingScoreItem, "id" | "createdAt">): TypingScoreItem {
    const newScore: TypingScoreItem = {
      ...score,
      id: `score-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.scores.push(newScore);
    this.persist();
    return newScore;
  }

  // Contact Messages
  addMessage(msg: Omit<ContactMessage, "id" | "createdAt">): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.messages.push(newMsg);
    this.persist();
    return newMsg;
  }
}

export const db = new DataStore();
