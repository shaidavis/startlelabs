import { AboutTemplate } from "@/components/templates/AboutTemplate";
import { aboutData } from "@/data/about";

export const metadata = {
  title: "About — Startle Labs",
  description:
    "We make brands impossible to ignore. Learn who we are, how we work, and why we care.",
};

export default function AboutPage() {
  return <AboutTemplate data={aboutData} />;
}
