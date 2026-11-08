import fs from "fs";
import path from "path";
import { Pool } from "pg";
import dotenv from "dotenv";
import { ProjectItem, TypingScoreItem, ContactMessage, OffScreenPhotoItem } from "../types";

dotenv.config();

const DATA_DIR = path.resolve(__dirname, "../../data");
const DB_FILE = path.join(DATA_DIR, "db.json");

export interface ProfileSettings {
  fullName: string;
  nickname: string;
  role: string;
  bio: string;
  location: string;
  university: string;
  focus: string;
  email: string;
  availability: string;
  cvUrl: string;
  cvFileName: string;
  updatedAt?: string;
}

const DEFAULT_PROFILE: ProfileSettings = {
  fullName: "Christopher Edgar",
  nickname: "Raged",
  role: "Informatics Student & Full-Stack / AI Builder",
  bio: "An Informatics student passionate about turning complex problems into clean, fast, and tactile digital products — from full-stack management systems and cross-platform Flutter mobile apps to NLP & AI explorations.",
  location: "Kebon Jeruk, West Jakarta, Indonesia",
  university: "B.Sc. in Informatics (S.Kom.)",
  focus: "Web · Mobile · AI/NLP",
  email: "edgar.edmanata@gmail.com",
  availability: "Available for internships, freelance & collaborations",
  cvUrl: "/CV-Christopher-Edgar.pdf",
  cvFileName: "CV-Christopher-Edgar.pdf",
};

interface DatabaseSchema {
  projects: ProjectItem[];
  scores: TypingScoreItem[];
  messages: ContactMessage[];
  photos: OffScreenPhotoItem[];
  profile?: ProfileSettings;
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
    images: [],
    imageUrl: "",
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
    images: [],
    imageUrl: "",
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
    images: [],
    imageUrl: "",
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

const DEFAULT_PHOTOS: OffScreenPhotoItem[] = [
  { id: "photo-1", caption: "coffee & toast", imageUrl: "", order: 1, rotation: -6 },
  { id: "photo-2", caption: "night lights", imageUrl: "", order: 2, rotation: -3 },
  { id: "photo-3", caption: "workspace desk", imageUrl: "", order: 3, rotation: -1 },
  { id: "photo-4", caption: "cat doodle", imageUrl: "", order: 4, rotation: 1 },
  { id: "photo-5", caption: "crescent moon", imageUrl: "", order: 5, rotation: -2 },
  { id: "photo-6", caption: "portrait", imageUrl: "", order: 6, rotation: 3 },
  { id: "photo-7", caption: "rocky cove", imageUrl: "", order: 7, rotation: -1 },
  { id: "photo-8", caption: "dog in the sun", imageUrl: "", order: 8, rotation: 5 },
];

function normalizeUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function mapRowToProject(row: any): ProjectItem {
  const tags = Array.isArray(row.tags) ? row.tags : [];
  const techStack = Array.isArray(row.tech_stack) && row.tech_stack.length > 0 ? row.tech_stack : tags;
  const images =
    Array.isArray(row.images) && row.images.length > 0
      ? row.images.filter(Boolean)
      : row.image_url
      ? [row.image_url]
      : [];
  const imageUrl = images[0] || row.image_url || "";
  const normalizedLive = normalizeUrl(row.live_url || row.project_url);
  const normalizedProject = normalizeUrl(row.project_url || row.live_url);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug || row.id,
    subtitle: row.subtitle || "",
    description: row.description,
    tags: tags.length > 0 ? tags : techStack,
    techStack,
    images,
    imageUrl,
    liveUrl: normalizedLive,
    projectUrl: normalizedProject,
    githubUrl: normalizeUrl(row.github_url),
    year: row.year || "2024",
    featured: Boolean(row.featured),
    order: typeof row.sort_order === "number" ? row.sort_order : 99,
    caseStudy: row.case_study || undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

function mapRowToPhoto(row: any): OffScreenPhotoItem {
  return {
    id: row.id,
    caption: row.caption,
    imageUrl: row.image_url || "",
    order: typeof row.sort_order === "number" ? row.sort_order : 1,
    rotation: Number(row.rotation) || 0,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

class DataStore {
  private data: DatabaseSchema;
  private pool: Pool | null = null;
  private isPostgresReady = false;

  constructor() {
    this.data = this.loadLocalJson();
  }

  public getStorageMode(): string {
    return this.isPostgresReady ? "postgresql" : "local-json-fallback";
  }

  /**
   * Initializes PostgreSQL connection pool, creates tables if missing,
   * and migrates any existing local db.json data on first run.
   */
  public async init(): Promise<void> {
    const rawDbUrl = process.env.DATABASE_URL?.trim();
    if (!rawDbUrl) {
      console.warn(
        "⚠️ [DataStore] DATABASE_URL is not set in environment. Running with local JSON file (ephemeral on Render!)."
      );
      return;
    }

    // Normalize connection string for node-postgres compatibility
    const dbUrl = rawDbUrl.replace(/[?&]channel_binding=require/g, "");
    const isLocalhost = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");

    try {
      this.pool = new Pool({
        connectionString: dbUrl,
        ssl: isLocalhost ? false : { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });

      // Verify connection & create schema
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS portfolio_meta (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS portfolio_projects (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT,
          subtitle TEXT,
          description TEXT NOT NULL,
          tags JSONB DEFAULT '[]'::jsonb,
          tech_stack JSONB DEFAULT '[]'::jsonb,
          image_url TEXT DEFAULT '',
          images JSONB DEFAULT '[]'::jsonb,
          live_url TEXT DEFAULT '',
          project_url TEXT DEFAULT '',
          github_url TEXT DEFAULT '',
          year TEXT DEFAULT '2024',
          featured BOOLEAN DEFAULT false,
          sort_order INTEGER DEFAULT 99,
          case_study JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS portfolio_photos (
          id TEXT PRIMARY KEY,
          caption TEXT NOT NULL,
          image_url TEXT DEFAULT '',
          sort_order INTEGER DEFAULT 1,
          rotation NUMERIC DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS typing_scores (
          id TEXT PRIMARY KEY,
          player_name TEXT NOT NULL,
          wpm INTEGER NOT NULL,
          accuracy NUMERIC NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS contact_messages (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      this.isPostgresReady = true;
      console.log("✅ [DataStore] Connected to PostgreSQL permanent storage!");

      await this.seedPostgresIfNeeded();
    } catch (err) {
      console.error("❌ [DataStore] Failed to initialize PostgreSQL, falling back to local JSON:", err);
      this.isPostgresReady = false;
      this.pool = null;
    }
  }

  private async seedPostgresIfNeeded(): Promise<void> {
    if (!this.pool) return;

    const metaRes = await this.pool.query(
      `SELECT value FROM portfolio_meta WHERE key = 'initial_seed_v1'`
    );
    const alreadySeeded = (metaRes.rowCount ?? 0) > 0;

    // Seed projects if never seeded and table is empty
    const projCountRes = await this.pool.query(`SELECT COUNT(*)::int AS cnt FROM portfolio_projects`);
    if (!alreadySeeded && projCountRes.rows[0].cnt === 0) {
      const sourceProjects = this.data.projects.length > 0 ? this.data.projects : DEFAULT_PROJECTS;
      for (const p of sourceProjects) {
        const images =
          Array.isArray(p.images) && p.images.length > 0
            ? p.images.filter(Boolean)
            : p.imageUrl
            ? [p.imageUrl]
            : [];
        const tags = p.tags || p.techStack || [];
        await this.pool.query(
          `INSERT INTO portfolio_projects (
            id, title, slug, subtitle, description, tags, tech_stack,
            image_url, images, live_url, project_url, github_url,
            year, featured, sort_order, case_study, created_at, updated_at
          ) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8,$9::jsonb,$10,$11,$12,$13,$14,$15,$16::jsonb,$17,$18)
          ON CONFLICT (id) DO NOTHING`,
          [
            p.id,
            p.title,
            p.slug || p.id,
            p.subtitle || "",
            p.description,
            JSON.stringify(tags),
            JSON.stringify(p.techStack || tags),
            images[0] || p.imageUrl || "",
            JSON.stringify(images),
            p.liveUrl || p.projectUrl || "",
            p.projectUrl || p.liveUrl || "",
            p.githubUrl || "",
            p.year || "2024",
            Boolean(p.featured),
            typeof p.order === "number" ? p.order : 99,
            p.caseStudy ? JSON.stringify(p.caseStudy) : null,
            p.createdAt || new Date().toISOString(),
            p.updatedAt || new Date().toISOString(),
          ]
        );
      }
      console.log(`🌱 [DataStore] Seeded ${sourceProjects.length} projects into PostgreSQL.`);
    }

    // Always ensure the 8 Off-Screen Polaroid slots exist if table is empty
    const photoCountRes = await this.pool.query(`SELECT COUNT(*)::int AS cnt FROM portfolio_photos`);
    if (photoCountRes.rows[0].cnt === 0) {
      const sourcePhotos = this.data.photos.length > 0 ? this.data.photos : DEFAULT_PHOTOS;
      for (const ph of sourcePhotos) {
        await this.pool.query(
          `INSERT INTO portfolio_photos (id, caption, image_url, sort_order, rotation, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
           ON CONFLICT (id) DO NOTHING`,
          [ph.id, ph.caption, ph.imageUrl || "", ph.order || 1, ph.rotation || 0]
        );
      }
      console.log(`🌱 [DataStore] Seeded ${sourcePhotos.length} off-screen photos into PostgreSQL.`);
    }

    // Seed default leaderboard scores if empty and never seeded
    const scoreCountRes = await this.pool.query(`SELECT COUNT(*)::int AS cnt FROM typing_scores`);
    if (!alreadySeeded && scoreCountRes.rows[0].cnt === 0) {
      const sourceScores = this.data.scores.length > 0 ? this.data.scores : DEFAULT_SCORES;
      for (const s of sourceScores) {
        await this.pool.query(
          `INSERT INTO typing_scores (id, player_name, wpm, accuracy, created_at)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING`,
          [s.id, s.playerName, s.wpm, s.accuracy, s.createdAt || new Date().toISOString()]
        );
      }
      console.log(`🌱 [DataStore] Seeded ${sourceScores.length} leaderboard scores into PostgreSQL.`);
    }

    if (!alreadySeeded) {
      await this.pool.query(
        `INSERT INTO portfolio_meta (key, value) VALUES ('initial_seed_v1', 'true')
         ON CONFLICT (key) DO UPDATE SET value = 'true', updated_at = NOW()`
      );
    }
  }

  private loadLocalJson(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.projects)) {
          parsed.projects = parsed.projects.map((p: any) => {
            const images =
              Array.isArray(p.images) && p.images.length > 0
                ? p.images.filter(Boolean)
                : p.imageUrl
                ? [p.imageUrl]
                : [];
            return {
              ...p,
              tags: p.tags || p.techStack || [],
              techStack: p.techStack || p.tags || [],
              images,
              imageUrl: images[0] || p.imageUrl || "",
            };
          });
        }
        if (!Array.isArray(parsed.photos)) {
          parsed.photos = DEFAULT_PHOTOS;
          this.persistLocalJson(parsed);
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
      photos: DEFAULT_PHOTOS,
    };
    this.persistLocalJson(initial);
    return initial;
  }

  private persistLocalJson(schema?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(schema || this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("[DataStore] Failed to write db.json:", err);
    }
  }

  // ============================================================================
  // Projects CRUD
  // ============================================================================
  async getProjects(): Promise<ProjectItem[]> {
    if (this.isPostgresReady && this.pool) {
      const res = await this.pool.query(
        `SELECT * FROM portfolio_projects ORDER BY sort_order ASC, created_at ASC`
      );
      return res.rows.map(mapRowToProject);
    }

    return [...this.data.projects]
      .map((p) => {
        const images =
          Array.isArray(p.images) && p.images.length > 0
            ? p.images.filter(Boolean)
            : p.imageUrl
            ? [p.imageUrl]
            : [];
        return {
          ...p,
          tags: p.tags || p.techStack || [],
          techStack: p.techStack || p.tags || [],
          images,
          imageUrl: images[0] || p.imageUrl || "",
        };
      })
      .sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  async getProjectById(id: string): Promise<ProjectItem | undefined> {
    if (this.isPostgresReady && this.pool) {
      const res = await this.pool.query(
        `SELECT * FROM portfolio_projects WHERE id = $1 OR slug = $1 LIMIT 1`,
        [id]
      );
      if ((res.rowCount ?? 0) > 0) {
        return mapRowToProject(res.rows[0]);
      }
      return undefined;
    }

    return this.data.projects.find(
      (p) => p.id === id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === id
    );
  }

  async createProject(item: Omit<ProjectItem, "id" | "createdAt" | "updatedAt">): Promise<ProjectItem> {
    const tags = item.tags || item.techStack || [];
    const images =
      Array.isArray(item.images) && item.images.length > 0
        ? item.images.filter(Boolean)
        : item.imageUrl
        ? [item.imageUrl]
        : [];
    const nowIso = new Date().toISOString();
    const newProject: ProjectItem = {
      ...item,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      tags,
      techStack: tags,
      images,
      imageUrl: images[0] || item.imageUrl || "",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    if (this.isPostgresReady && this.pool) {
      const res = await this.pool.query(
        `INSERT INTO portfolio_projects (
          id, title, slug, subtitle, description, tags, tech_stack,
          image_url, images, live_url, project_url, github_url,
          year, featured, sort_order, case_study, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8,$9::jsonb,$10,$11,$12,$13,$14,$15,$16::jsonb,$17,$18)
        RETURNING *`,
        [
          newProject.id,
          newProject.title,
          newProject.slug || newProject.id,
          newProject.subtitle || "",
          newProject.description,
          JSON.stringify(tags),
          JSON.stringify(tags),
          newProject.imageUrl || "",
          JSON.stringify(images),
          newProject.liveUrl || newProject.projectUrl || "",
          newProject.projectUrl || newProject.liveUrl || "",
          newProject.githubUrl || "",
          newProject.year || "2024",
          Boolean(newProject.featured),
          typeof newProject.order === "number" ? newProject.order : 99,
          newProject.caseStudy ? JSON.stringify(newProject.caseStudy) : null,
          nowIso,
          nowIso,
        ]
      );
      return mapRowToProject(res.rows[0]);
    }

    this.data.projects.push(newProject);
    this.persistLocalJson();
    return newProject;
  }

  async updateProject(id: string, updates: Partial<ProjectItem>): Promise<ProjectItem | null> {
    if (this.isPostgresReady && this.pool) {
      const existing = await this.getProjectById(id);
      if (!existing) return null;

      const tags = updates.tags || updates.techStack || existing.tags || [];
      let images: string[];
      if (Array.isArray(updates.images)) {
        images = updates.images.filter(Boolean);
      } else if (updates.imageUrl !== undefined) {
        images = updates.imageUrl ? [updates.imageUrl] : [];
      } else {
        images = existing.images || (existing.imageUrl ? [existing.imageUrl] : []);
      }
      const imageUrl = images[0] || "";

      const merged: ProjectItem = {
        ...existing,
        ...updates,
        tags,
        techStack: tags,
        images,
        imageUrl,
        updatedAt: new Date().toISOString(),
      };

      const res = await this.pool.query(
        `UPDATE portfolio_projects SET
          title = $2,
          slug = $3,
          subtitle = $4,
          description = $5,
          tags = $6::jsonb,
          tech_stack = $7::jsonb,
          image_url = $8,
          images = $9::jsonb,
          live_url = $10,
          project_url = $11,
          github_url = $12,
          year = $13,
          featured = $14,
          sort_order = $15,
          case_study = $16::jsonb,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *`,
        [
          existing.id,
          merged.title,
          merged.slug || existing.slug || existing.id,
          merged.subtitle || "",
          merged.description,
          JSON.stringify(tags),
          JSON.stringify(tags),
          imageUrl,
          JSON.stringify(images),
          merged.liveUrl || merged.projectUrl || "",
          merged.projectUrl || merged.liveUrl || "",
          merged.githubUrl || "",
          merged.year || "2024",
          Boolean(merged.featured),
          typeof merged.order === "number" ? merged.order : 99,
          merged.caseStudy ? JSON.stringify(merged.caseStudy) : null,
        ]
      );
      if ((res.rowCount ?? 0) === 0) return null;
      return mapRowToProject(res.rows[0]);
    }

    const idx = this.data.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const existing = this.data.projects[idx];
    const tags = updates.tags || updates.techStack || existing.tags || [];
    let images: string[];
    if (Array.isArray(updates.images)) {
      images = updates.images.filter(Boolean);
    } else if (updates.imageUrl !== undefined) {
      images = updates.imageUrl ? [updates.imageUrl] : [];
    } else {
      images = existing.images || (existing.imageUrl ? [existing.imageUrl] : []);
    }
    const imageUrl = images[0] || "";
    const updated: ProjectItem = {
      ...existing,
      ...updates,
      tags,
      techStack: tags,
      images,
      imageUrl,
      updatedAt: new Date().toISOString(),
    };
    this.data.projects[idx] = updated;
    this.persistLocalJson();
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    if (this.isPostgresReady && this.pool) {
      const res = await this.pool.query(`DELETE FROM portfolio_projects WHERE id = $1`, [id]);
      return (res.rowCount ?? 0) > 0;
    }

    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    const deleted = this.data.projects.length < initialLen;
    if (deleted) this.persistLocalJson();
    return deleted;
  }

  // ============================================================================
  // Scores CRUD
  // ============================================================================
  async getLeaderboard(limit = 10): Promise<TypingScoreItem[]> {
    if (this.isPostgresReady && this.pool) {
      const res = await this.pool.query(
        `SELECT * FROM typing_scores ORDER BY wpm DESC, accuracy DESC, created_at ASC LIMIT $1`,
        [limit]
      );
      return res.rows.map((r) => ({
        id: r.id,
        playerName: r.player_name,
        wpm: Number(r.wpm),
        accuracy: Number(r.accuracy),
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    }

    return [...this.data.scores]
      .sort((a, b) => {
        if (b.wpm !== a.wpm) return b.wpm - a.wpm;
        return b.accuracy - a.accuracy;
      })
      .slice(0, limit);
  }

  async addScore(score: Omit<TypingScoreItem, "id" | "createdAt">): Promise<TypingScoreItem> {
    const newScore: TypingScoreItem = {
      ...score,
      id: `score-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    if (this.isPostgresReady && this.pool) {
      await this.pool.query(
        `INSERT INTO typing_scores (id, player_name, wpm, accuracy, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [newScore.id, newScore.playerName, newScore.wpm, newScore.accuracy, newScore.createdAt]
      );
      return newScore;
    }

    this.data.scores.push(newScore);
    this.persistLocalJson();
    return newScore;
  }

  // ============================================================================
  // Contact Messages
  // ============================================================================
  async addMessage(msg: Omit<ContactMessage, "id" | "createdAt">): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    if (this.isPostgresReady && this.pool) {
      await this.pool.query(
        `INSERT INTO contact_messages (id, name, email, message, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [newMsg.id, newMsg.name, newMsg.email, newMsg.message, newMsg.createdAt]
      );
      return newMsg;
    }

    this.data.messages.push(newMsg);
    this.persistLocalJson();
    return newMsg;
  }

  // ============================================================================
  // Off-Screen Polaroid Photos CRUD
  // ============================================================================
  async getPhotos(): Promise<OffScreenPhotoItem[]> {
    if (this.isPostgresReady && this.pool) {
      const res = await this.pool.query(
        `SELECT * FROM portfolio_photos ORDER BY sort_order ASC, created_at ASC`
      );
      return res.rows.map(mapRowToPhoto);
    }

    return [...(this.data.photos || [])].sort((a, b) => a.order - b.order);
  }

  async getPhotoById(id: string): Promise<OffScreenPhotoItem | undefined> {
    if (this.isPostgresReady && this.pool) {
      const res = await this.pool.query(`SELECT * FROM portfolio_photos WHERE id = $1 LIMIT 1`, [
        id,
      ]);
      if ((res.rowCount ?? 0) > 0) {
        return mapRowToPhoto(res.rows[0]);
      }
      return undefined;
    }

    return (this.data.photos || []).find((p) => p.id === id);
  }

  async updatePhoto(
    id: string,
    updates: Partial<OffScreenPhotoItem>
  ): Promise<OffScreenPhotoItem | null> {
    if (this.isPostgresReady && this.pool) {
      const existing = await this.getPhotoById(id);
      if (!existing) return null;
      const merged = { ...existing, ...updates };
      const res = await this.pool.query(
        `UPDATE portfolio_photos SET
          caption = $2,
          image_url = $3,
          sort_order = $4,
          rotation = $5,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *`,
        [
          id,
          merged.caption || "",
          merged.imageUrl || "",
          typeof merged.order === "number" ? merged.order : 1,
          typeof merged.rotation === "number" ? merged.rotation : 0,
        ]
      );
      if ((res.rowCount ?? 0) === 0) return null;
      return mapRowToPhoto(res.rows[0]);
    }

    if (!this.data.photos) this.data.photos = [...DEFAULT_PHOTOS];
    const index = this.data.photos.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.photos[index] = {
      ...this.data.photos[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persistLocalJson();
    return this.data.photos[index];
  }

  async updateAllPhotos(photos: OffScreenPhotoItem[]): Promise<OffScreenPhotoItem[]> {
    if (this.isPostgresReady && this.pool) {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        for (let idx = 0; idx < photos.length; idx++) {
          const p = photos[idx];
          const photoId = p.id || `photo-${idx + 1}`;
          const sortOrder = typeof p.order === "number" ? p.order : idx + 1;
          await client.query(
            `INSERT INTO portfolio_photos (id, caption, image_url, sort_order, rotation, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
             ON CONFLICT (id) DO UPDATE SET
               caption = EXCLUDED.caption,
               image_url = EXCLUDED.image_url,
               sort_order = EXCLUDED.sort_order,
               rotation = EXCLUDED.rotation,
               updated_at = NOW()`,
            [
              photoId,
              p.caption || "",
              p.imageUrl || "",
              sortOrder,
              typeof p.rotation === "number" ? p.rotation : 0,
            ]
          );
        }
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
      return this.getPhotos();
    }

    this.data.photos = photos.map((p, idx) => ({
      ...p,
      order: typeof p.order === "number" ? p.order : idx + 1,
      updatedAt: new Date().toISOString(),
    }));
    this.persistLocalJson();
    return this.getPhotos();
  }

  async createPhoto(photo: Omit<OffScreenPhotoItem, "id">): Promise<OffScreenPhotoItem> {
    const nowIso = new Date().toISOString();
    const newPhoto: OffScreenPhotoItem = {
      ...photo,
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    if (this.isPostgresReady && this.pool) {
      const res = await this.pool.query(
        `INSERT INTO portfolio_photos (id, caption, image_url, sort_order, rotation, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          newPhoto.id,
          newPhoto.caption || "",
          newPhoto.imageUrl || "",
          typeof newPhoto.order === "number" ? newPhoto.order : 99,
          typeof newPhoto.rotation === "number" ? newPhoto.rotation : 0,
          nowIso,
          nowIso,
        ]
      );
      return mapRowToPhoto(res.rows[0]);
    }

    if (!this.data.photos) this.data.photos = [...DEFAULT_PHOTOS];
    this.data.photos.push(newPhoto);
    this.persistLocalJson();
    return newPhoto;
  }

  async deletePhoto(id: string): Promise<boolean> {
    if (this.isPostgresReady && this.pool) {
      const res = await this.pool.query(`DELETE FROM portfolio_photos WHERE id = $1`, [id]);
      return (res.rowCount ?? 0) > 0;
    }

    if (!this.data.photos) return false;
    const initialLen = this.data.photos.length;
    this.data.photos = this.data.photos.filter((p) => p.id !== id);
    const deleted = this.data.photos.length < initialLen;
    if (deleted) this.persistLocalJson();
    return deleted;
  }

  // ==========================================
  // PROFILE & CV SETTINGS
  // ==========================================
  async getProfile(): Promise<ProfileSettings> {
    if (this.isPostgresReady && this.pool) {
      try {
        const res = await this.pool.query(
          `SELECT value, updated_at FROM portfolio_meta WHERE key = 'profile_settings' LIMIT 1`
        );
        if ((res.rowCount ?? 0) > 0 && res.rows[0].value) {
          const parsed = JSON.parse(res.rows[0].value);
          return {
            ...DEFAULT_PROFILE,
            ...parsed,
            updatedAt: res.rows[0].updated_at
              ? new Date(res.rows[0].updated_at).toISOString()
              : parsed.updatedAt,
          };
        }
      } catch (err) {
        console.warn("[DataStore] Failed to parse profile_settings from Postgres:", err);
      }
    }

    return {
      ...DEFAULT_PROFILE,
      ...(this.data.profile || {}),
    };
  }

  async updateProfile(updates: Partial<ProfileSettings>): Promise<ProfileSettings> {
    const current = await this.getProfile();
    const merged: ProfileSettings = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (this.isPostgresReady && this.pool) {
      await this.pool.query(
        `INSERT INTO portfolio_meta (key, value, updated_at)
         VALUES ('profile_settings', $1, NOW())
         ON CONFLICT (key) DO UPDATE SET
           value = EXCLUDED.value,
           updated_at = NOW()`,
        [JSON.stringify(merged)]
      );
      return merged;
    }

    this.data.profile = merged;
    this.persistLocalJson();
    return merged;
  }
}

export const db = new DataStore();
