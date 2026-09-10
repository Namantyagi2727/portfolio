import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import Footer from "@/components/Footer";

// Cycle 1 ships an intentionally short slice of the redesign — the legacy
// dark-themed sections (About, Skills, Experience, Projects, Publications,
// Side Quests, Contact) are gated out here, not deleted, until Cycle 2
// re-skins them for the new light palette.
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SelectedWork />
      </main>
      <Footer />
    </>
  );
}
