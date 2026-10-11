import { featuredProjects } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import PrismPreview from "./PrismPreview";
import ProjectPreview from "./ProjectPreview";
import OtherProjects from "./OtherProjects";

// Featured gallery = the four projects that together show the breadth of the
// work: LLM infrastructure (Prism), applied AI (RAGBase), full-stack systems
// (ConTicx), and data/testing (Immune Cell). The research and NYU case-study
// pages (/work/medical-cv, /work/faculty-ops) are linked from Experience, and
// /work/airspace from the Other Projects index — none of them are orphaned.
export default function SelectedWork() {
  return (
    <section id="work" className="px-6">
      <div className="max-w-6xl mx-auto">
        <div className="pt-12 sm:pt-20 mb-8 lg:mb-10">
          <SectionLabel label="Selected Work" as="h2" index="01" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <PrismPreview />
          {featuredProjects.map((project) => (
            <ProjectPreview key={project.slug} project={project} />
          ))}
        </div>
        <OtherProjects />
      </div>
    </section>
  );
}
