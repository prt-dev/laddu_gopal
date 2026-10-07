import Hero from "@/components/web/Hero";
import AboutSection from "@/components/web/AboutSection";
import ProductCollection from "@/components/web/ProductCollection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductCollection type="top-selling" />
      <AboutSection />
      <ProductCollection type="pagdi" />
      <ProductCollection type="kundan" />
    </>
  );
}
