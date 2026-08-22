import Hero from "../components/web/Hero";
import Features from "../components/web/Features";
import FruitShop from "../components/web/FruitShop";
import ServiceBanner from "../components/web/ServiceBanner";
import VegetableShop from "../components/web/VegetableShop";
import Banner from "../components/web/Banner";
import Bestsellers from "../components/web/Bestsellers";
import Facts from "../components/web/Facts";
import Testimonials from "../components/web/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <FruitShop />
      <ServiceBanner />
      <VegetableShop />
      <Banner />
      <Bestsellers />
      <Facts />
      <Testimonials />
    </>
  );
}
