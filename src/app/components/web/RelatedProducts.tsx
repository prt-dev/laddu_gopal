const relatedProducts = [
  { img: "/assets/img/featur-1.jpg", name: "Modern Web Architecture Playbook", category: "Web Dev", price: "₹499.00", slug: "modern-web-architecture" },
  { img: "/assets/img/featur-2.jpg", name: "AI Agent Engineering Handbook", category: "AI & ML", price: "₹699.00", slug: "ai-agent-engineering" },
  { img: "/assets/img/featur-3.jpg", name: "Design Systems at Enterprise Scale", category: "Design", price: "₹399.00", slug: "design-systems-scale" },
  { img: "/assets/img/banner-fruits.jpg", name: "The Startup Velocity Playbook", category: "Startups", price: "₹550.00", slug: "bootstrapping-to-1m-arr" },
  { img: "/assets/img/single-item.jpg", name: "The Staff Engineer Roadmap", category: "Leadership", price: "₹450.00", slug: "engineering-leadership" },
  { img: "/assets/img/best-product-1.jpg", name: "Distributed Systems in Practice", category: "Cloud", price: "₹599.00", slug: "distributed-systems-patterns" },
];

export default function RelatedProducts() {
  return (
    <>
      <h1 className="fw-bold mb-4">Related Publications You May Like</h1>
      <div className="vesitable">
        <div className="owl-carousel vegetable-carousel justify-content-center">
          {relatedProducts.map((p, i) => (
            <div
              key={i}
              className="border rounded position-relative vesitable-item bg-white shadow-sm"
            >
              <div className="vesitable-img" style={{ height: "200px", overflow: "hidden" }}>
                <img
                  src={p.img}
                  className="img-fluid w-100 h-100 rounded-top"
                  style={{ objectFit: "cover" }}
                  alt={p.name}
                />
              </div>
              <div
                className="text-white bg-primary px-3 py-1 rounded-pill position-absolute small font-weight-bold"
                style={{ top: 10, right: 10, fontSize: "0.75rem" }}
              >
                {p.category}
              </div>
              <div className="p-4 pb-0 rounded-bottom text-start">
                <h5 className="text-truncate fs-6 fw-bold text-dark mb-1" title={p.name}>{p.name}</h5>
                <p className="text-muted small text-truncate">
                  Comprehensive guide with diagrams and code samples.
                </p>
                <div className="d-flex justify-content-between flex-lg-wrap align-items-center mt-3">
                  <p className="text-dark fs-5 fw-bold mb-4">{p.price}</p>
                  <a
                    href={`/blog-preview?slug=${p.slug}`}
                    className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 mb-4 fw-bold"
                  >
                    View Guide
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
