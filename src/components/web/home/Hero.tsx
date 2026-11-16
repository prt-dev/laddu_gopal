import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden w-full">
      {/* Desktop / Tablet Hero */}
      <div className="hidden sm:block w-full">
        <Image
          src="/assets/hero.png"
          alt="Makhan Chor - Laddu Gopal Devotional Collection"
          width={1920}
          height={750}
          priority
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Mobile Hero */}
      <div className="block sm:hidden w-full">
        <Image
          src="/assets/hero_mobile.png"
          alt="Makhan Chor - Laddu Gopal Devotional Collection"
          width={800}
          height={900}
          priority
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
}

