export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export const team: TeamMember[] = [
  {
    name: "Team Member One",
    role: "Founder & Creative Director",
    image: "/images/team/placeholder-1.jpg",
    bio: "Placeholder bio about the founder and their vision for the agency.",
  },
  {
    name: "Team Member Two",
    role: "Head of Strategy",
    image: "/images/team/placeholder-2.jpg",
    bio: "Placeholder bio about the strategist and their approach.",
  },
  {
    name: "Team Member Three",
    role: "Lead Designer",
    image: "/images/team/placeholder-3.jpg",
    bio: "Placeholder bio about the designer and their craft.",
  },
];
