import SectionLabel from "./SectionLabel";
import PrismCaseStudy from "./PrismCaseStudy";
import MedicalVisionCaseStudy from "./MedicalVisionCaseStudy";
import FacultyOpsCaseStudy from "./FacultyOpsCaseStudy";
import AirspaceCaseStudy from "./AirspaceCaseStudy";
import OtherProjects from "./OtherProjects";

export default function SelectedWork() {
  return (
    <section id="work" className="px-6">
      <div className="max-w-5xl mx-auto">
        <div className="pt-20">
          <SectionLabel label="Selected Work" as="h2" />
        </div>
        <PrismCaseStudy />
        <MedicalVisionCaseStudy />
        <FacultyOpsCaseStudy />
        <AirspaceCaseStudy />
        <OtherProjects />
      </div>
    </section>
  );
}
