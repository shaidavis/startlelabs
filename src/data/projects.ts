export interface Project {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  accentColor: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    slug: "project-1",
    title: "Project One",
    description: "A bold brand identity for a forward-thinking company.",
    heroImage: "/images/projects/placeholder-1.jpg",
    accentColor: "#2563eb",
    tags: ["Brand Identity", "Strategy"],
  },
  {
    slug: "project-2",
    title: "Project Two",
    description: "Visual storytelling that captures the essence of innovation.",
    heroImage: "/images/projects/placeholder-2.jpg",
    accentColor: "#16a34a",
    tags: ["Web Design", "Development"],
  },
  {
    slug: "project-3",
    title: "Project Three",
    description: "A comprehensive rebrand that transformed market perception.",
    heroImage: "/images/projects/placeholder-3.jpg",
    accentColor: "#dc2626",
    tags: ["Rebrand", "Art Direction"],
  },
  {
    slug: "project-4",
    title: "Project Four",
    description: "Digital experience design that drives engagement.",
    heroImage: "/images/projects/placeholder-4.jpg",
    accentColor: "#9333ea",
    tags: ["Digital", "UX Design"],
  },
  {
    slug: "project-5",
    title: "Project Five",
    description: "Packaging design that stands out on every shelf.",
    heroImage: "/images/projects/placeholder-5.jpg",
    accentColor: "#ea580c",
    tags: ["Packaging", "Print"],
  },
];
