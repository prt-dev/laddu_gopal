const categories = [
  { label: "Web Architecture & Next.js", count: 28 },
  { label: "AI Engineering & LLMs", count: 20 },
  { label: "Backend, APIs & Rust", count: 15 },
  { label: "Design Systems & UI", count: 12 },
  { label: "Product & Growth Strategy", count: 10 },
];

const featuredProducts = [
  { img: "/assets/img/featur-1.jpg", name: "Modern Web Architecture", price: "₹499.00", oldPrice: "₹799.00", stars: 5, slug: "modern-web-architecture" },
  { img: "/assets/img/featur-2.jpg", name: "AI Agent Engineering", price: "₹699.00", oldPrice: "₹999.00", stars: 5, slug: "ai-agent-engineering" },
  { img: "/assets/img/featur-3.jpg", name: "Design Systems at Scale", price: "₹399.00", oldPrice: "₹599.00", stars: 5, slug: "design-systems-scale" },
  { img: "/assets/img/banner-fruits.jpg", name: "Zero to One Mindset", price: "₹420.00", oldPrice: "₹500.00", stars: 5, slug: "product-mindset" },
];

function StarRating({ filled }: { filled: number }) {
  return (
    <div className="d-flex mb-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={`fa fa-star${n <= filled ? " text-secondary" : ""}`} />
      ))}
    </div>
  );
}

export default function DetailSidebar() {
  return (
    <div className="col-lg-4 col-xl-3">
      <div className="row g-4 fruite">

        {/* Search */}
        <div className="col-lg-12">
          <div className="input-group w-100 mx-auto d-flex mb-4">
            <input
              type="search"
              className="form-control p-3"
              placeholder="Search guides..."
              aria-describedby="detail-search-icon"
            />
            <span id="detail-search-icon" className="input-group-text p-3">
              <i className="fa fa-search" />
            </span>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <h4 className="fw-bold">Topics</h4>
            <ul className="list-unstyled fruite-categorie">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <div className="d-flex justify-content-between fruite-name py-1">
                    <a href="/shop" className="text-secondary text-decoration-none">
                      <i className="fas fa-bookmark me-2 text-primary" />
                      {cat.label}
                    </a>
                    <span className="text-muted">({cat.count})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Featured Products */}
        <div className="col-lg-12">
          <h4 className="mb-4 fw-bold">Top Publications</h4>
          {featuredProducts.map((p, i) => (
            <div
              key={i}
              className="d-flex align-items-center justify-content-start mb-3 bg-white p-2 rounded border"
            >
              <div className="rounded me-3" style={{ width: 70, height: 70, overflow: "hidden" }}>
                <img src={p.img} className="img-fluid rounded w-100 h-100" style={{ objectFit: "cover" }} alt={p.name} />
              </div>
              <div>
                <h6 className="mb-1 text-truncate" style={{ maxWidth: "140px" }} title={p.name}>
                  <a href={`/blog-preview?slug=${p.slug}`} className="text-dark text-decoration-none">{p.name}</a>
                </h6>
                <StarRating filled={p.stars} />
                <div className="d-flex mb-0">
                  <span className="fw-bold text-primary me-2 small">{p.price}</span>
                  <span className="text-muted text-decoration-line-through small">
                    {p.oldPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-center my-4">
            <a
              href="/shop"
              className="btn border border-secondary px-4 py-2 rounded-pill text-primary w-100 fw-bold"
            >
              View More Guides
            </a>
          </div>
        </div>

        {/* Sidebar Banner */}
        <div className="col-lg-12">
          <div className="position-relative rounded overflow-hidden shadow-sm">
            <img
              src="/assets/img/featur-2.jpg"
              className="img-fluid w-100 rounded"
              style={{ height: "250px", objectFit: "cover" }}
              alt="BlogVerse Community"
            />
            <div
              className="position-absolute p-3 rounded"
              style={{ top: "50%", left: 10, transform: "translateY(-50%)", backgroundColor: "rgba(255,255,255,0.9)" }}
            >
              <h5 className="text-primary fw-bold mb-0">
                Join <br /> 50,000+ <br /> Writers
              </h5>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
