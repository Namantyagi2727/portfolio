import SectionLabel from "./SectionLabel";
import PrismCaseStudy from "./PrismCaseStudy";
import MedicalVisionCaseStudy from "./MedicalVisionCaseStudy";
import FacultyOpsCaseStudy from "./FacultyOpsCaseStudy";

export default function SelectedWork() {
  return (
    <section id="work" className="px-6">
      <div className="max-w-5xl mx-auto">
        <div className="pt-20">
          <SectionLabel label="Selected Work" />
        </div>
        <PrismCaseStudy />
        <MedicalVisionCaseStudy />
        <FacultyOpsCaseStudy />
      </div>
    </section>
  );
}
