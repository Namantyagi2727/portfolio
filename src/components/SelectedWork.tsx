import SectionLabel from "./SectionLabel";
import PrismPreview from "./PrismPreview";
import MedicalVisionPreview from "./MedicalVisionPreview";
import FacultyOpsPreview from "./FacultyOpsPreview";
import AirspacePreview from "./AirspacePreview";
import OtherProjects from "./OtherProjects";

export default function SelectedWork() {
  return (
    <section id="work" className="px-6">
      <div className="max-w-6xl mx-auto">
        <div className="pt-12 sm:pt-20">
          <SectionLabel label="Selected Work" as="h2" index="01" />
        </div>
        <PrismPreview />
        <MedicalVisionPreview />
        <FacultyOpsPreview />
        <AirspacePreview />
        <OtherProjects />
      </div>
    </section>
  );
}
