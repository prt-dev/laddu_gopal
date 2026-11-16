const bestsellerCards = [
  { img: "featur-1.jpg", name: "Modern Web Architecture Playbook", price: "Free Read", stars: 5, slug: "modern-web-architecture" },
  { img: "featur-2.jpg", name: "AI Agent Engineering Handbook", price: "Free Read", stars: 5, slug: "ai-agent-engineering" },
  { img: "featur-3.jpg", name: "Design Systems at Enterprise Scale", price: "Free Read", stars: 5, slug: "design-systems-scale" },
  { img: "banner-fruits.jpg", name: "Zero to One: The Product Mindset", price: "Free Read", stars: 5, slug: "product-mindset" },
  { img: "best-product-1.jpg", name: "Distributed Systems & Cloud Patterns", price: "Free Read", stars: 5, slug: "distributed-systems-patterns" },
  { img: "best-product-2.jpg", name: "Mastering TypeScript & Modern Tooling", price: "Free Read", stars: 5, slug: "mastering-typescript" },
];

const featuredItems = [
  { img: "single-item.jpg", name: "The Complete Guide to Next.js 15 & App Router", price: "Featured Guide", stars: 5, slug: "nextjs-15-app-router" },
  { img: "featur-2.jpg", name: "Building Production LLM Applications", price: "Featured Guide", stars: 5, slug: "production-llm-applications" },
  { img: "best-product-3.jpg", name: "Engineering Leadership in Remote Teams", price: "Featured Guide", stars: 5, slug: "engineering-leadership" },
  { img: "featur-1.jpg", name: "UI Micro-Animations & Motion Design", price: "Featured Guide", stars: 5, slug: "ui-micro-animations" },
];

function StarRating({ count, total = 5 }: { count: number; total?: number }) {
  return (
    <div className="d-flex my-2">
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={`fas fa-star${i < count ? " text-primary" : ""}`}></i>
      ))}
    </div>
  );
}

export default function Bestsellers() {
  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        {/* Section Header */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
          <h1 className="display-5 fw-bold">Editor&apos;s Choice &amp; Top Guides</h1>
          <p className="text-secondary fs-5">
            Our most acclaimed technology deep-dives, architectural guides, and engineering playbooks curated for your continuous growth.
          </p>
        </div>

        <div className="row g-4">
          {/* Horizontal bestseller cards */}
          {bestsellerCards.map((p, i) => (
            <div className="col-lg-6 col-xl-4" key={i}>
              <div className="p-4 rounded bg-light border shadow-sm h-100">
                <div className="row align-items-center">
                  <div className="col-5">
                    <img src={`/assets/img/${p.img}`} className="img-fluid rounded w-100" style={{ height: "110px", objectFit: "cover" }} alt={p.name} />
                  </div>
                  <div className="col-7 text-start">
                    <a href={`/blog-preview?slug=${p.slug}`} className="h6 fw-bold d-block text-truncate text-dark text-decoration-none" title={p.name}>{p.name}</a>
                    <StarRating count={p.stars} />
                    <span className="badge bg-secondary text-dark mb-3">{p.price}</span>
                    <div>
                      <a href={`/blog-preview?slug=${p.slug}`} className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">
                        Read Story &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Featured item cards */}
          {featuredItems.map((p, i) => (
            <div className="col-md-6 col-lg-6 col-xl-3" key={`feat-${i}`}>
              <div className="text-center p-3 rounded bg-light border shadow-sm h-100 d-flex flex-column">
                <img src={`/assets/img/${p.img}`} className="img-fluid rounded w-100" style={{ height: "200px", objectFit: "cover" }} alt={p.name} />
                <div className="py-3 d-flex flex-column flex-grow-1">
                  <a href={`/blog-preview?slug=${p.slug}`} className="h6 fw-bold d-block text-dark text-decoration-none mb-1" title={p.name}>{p.name}</a>
                  <div className="d-flex my-2 justify-content-center">
                    {Array.from({ length: 5 }, (_, j) => (
                      <i key={j} className={`fas fa-star${j < p.stars ? " text-primary" : ""}`}></i>
                    ))}
                  </div>
                  <span className="badge bg-primary text-white mx-auto mb-3">{p.price}</span>
                  <div className="mt-auto">
                    <a href={`/blog-preview?slug=${p.slug}`} className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">
                      Read Guide &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
