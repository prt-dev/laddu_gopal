import Hero from "@/components/web/home/Hero";
import AboutSection from "@/components/web/home/AboutSection";
import ProductCollection from "@/components/web/products/ProductCollection";

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
