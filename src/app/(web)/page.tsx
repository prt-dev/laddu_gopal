import Hero from "../components/web/Hero";
import TopSelling from "../components/web/TopSelling";
import AboutSection from "../components/web/AboutSection";
import PagdiCollection from "../components/web/PagdiCollection";
import KundanCollection from "../components/web/KundanCollection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TopSelling />
      <AboutSection />
      <PagdiCollection />
      <KundanCollection />
    </>
  );
}
