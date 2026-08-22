const trendingStories = [
  { img: "featur-1.jpg", name: "The Future of Next.js & Server Components in 2026", category: "Frameworks", readTime: "5 min read", slug: "future-of-nextjs" },
  { img: "featur-2.jpg", name: "Building High-Throughput APIs with Python & Rust", category: "Backend", readTime: "8 min read", slug: "high-throughput-apis" },
  { img: "featur-3.jpg", name: "Crafting Accessible & Fluid UI Components", category: "UI/UX", readTime: "4 min read", slug: "accessible-fluid-ui" },
  { img: "banner-fruits.jpg", name: "The Rise of Autonomous AI Developer Agents", category: "AI", readTime: "7 min read", slug: "rise-of-ai-agents" },
  { img: "single-item.jpg", name: "A Deep Dive into Database Sharding & Indexing", category: "Databases", readTime: "10 min read", slug: "database-sharding-indexing" },
  { img: "best-product-1.jpg", name: "Essential Mental Models for Software Architects", category: "Leadership", readTime: "6 min read", slug: "mental-models-architects" },
];

export default function VegetableShop() {
  return (
    <div className="container-fluid vesitable py-5">
      <div className="container py-5">
        <h1 className="mb-0 fw-bold">Trending Stories &amp; Discussions</h1>
        <p className="text-secondary mb-4">Most read and debated articles across the BlogVerse community this week.</p>
        <div className="owl-carousel vegetable-carousel justify-content-center">
          {trendingStories.map((v, i) => (
            <div className="border rounded position-relative vesitable-item bg-white shadow-sm" key={i}>
              <div className="vesitable-img" style={{ height: "200px", overflow: "hidden" }}>
                <img
                  src={`/assets/img/${v.img}`}
                  className="img-fluid w-100 h-100 rounded-top"
                  style={{ objectFit: "cover" }}
                  alt={v.name}
                />
              </div>
              <div
                className="text-white bg-primary px-3 py-1 rounded-pill position-absolute small font-weight-bold"
                style={{ top: "10px", right: "10px", fontSize: "0.75rem" }}
              >
                {v.category}
              </div>
              <div className="p-4 rounded-bottom text-start">
                <h5 className="text-truncate fs-6 fw-bold text-dark mb-2" title={v.name}>{v.name}</h5>
                <div className="d-flex justify-content-between flex-lg-wrap align-items-center mt-3 pt-2 border-top">
                  <span className="text-muted small"><i className="fa fa-clock text-secondary me-1"></i>{v.readTime}</span>
                  <a href={`/blog-preview?slug=${v.slug}`} className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">
                    Read Story
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
