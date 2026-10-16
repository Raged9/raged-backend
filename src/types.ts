export interface ProjectItem {
  id: string;
  title: string;
  slug?: string;
  subtitle?: string;
  description: string;
  tags?: string[];
  techStack?: string[];
  imageUrl?: string;
  liveUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  year?: string;
  featured?: boolean;
  order?: number;
  caseStudy?: {
    challenge: string;
    solution: string;
    techStack: string[];
    lessons: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface TypingScoreItem {
  id: string;
  playerName: string;
  wpm: number;
  accuracy: number;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface OffScreenPhotoItem {
  id: string;
  caption: string;
  imageUrl?: string;
  order: number;
  rotation?: number;
  createdAt?: string;
  updatedAt?: string;
}
