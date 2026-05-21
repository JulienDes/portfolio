export interface ProjectLink {
  name: { en: string; fr: string };
  url: string;
}

export interface ProjectSection {
  title: { en: string; fr: string };
  paragraphs: { en: string[]; fr: string[] };
}

export interface Project {
  id: string;
  title: { en: string; fr: string };
  subtitle: { en: string; fr: string };
  summary: { en: string; fr: string };
  date: string;
  stack: string[];
  sections: ProjectSection[];
  duration: { en: string; fr: string };
  role: { en: string; fr: string };
  team: { en: string; fr: string };
  image: string;
  tags: { en: string; fr: string }[];
  links: ProjectLink[];
}
