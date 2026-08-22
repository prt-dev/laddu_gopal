const products = [
  { img: "/assets/img/featur-1.jpg", category: "Web Engineering", name: "Modern Web Architecture (2026 Edition)", price: "₹499.00", desc: "Complete guide to Next.js, micro-frontends, and performance optimization." },
  { img: "/assets/img/featur-2.jpg", category: "AI & ML", name: "Autonomous Agents & LLM Engineering", price: "₹699.00", desc: "Practical patterns for building production AI assistants and agents." },
  { img: "/assets/img/featur-3.jpg", category: "Design Systems", name: "Design Systems for Enterprise Apps", price: "₹399.00", desc: "Component architecture, tokens, accessibility, and fluid design." },
  { img: "/assets/img/banner-fruits.jpg", category: "Product & Growth", name: "The Startup Velocity Playbook", price: "₹550.00", desc: "Scaling digital products from zero to one with lean engineering." },
  { img: "/assets/img/single-item.jpg", category: "Engineering Lead", name: "The Staff Engineer Roadmap", price: "₹450.00", desc: "Technical leadership, architecture reviews, and team impact." },
  { img: "/assets/img/best-product-1.jpg", category: "Cloud & DevOps", name: "Distributed Systems in Practice", price: "₹599.00", desc: "Event-driven architecture, Kubernetes, and high availability." },
  { img: "/assets/img/best-product-2.jpg", category: "Languages", name: "TypeScript 5.x Deep Dive", price: "₹350.00", desc: "Advanced types, generics, metaprogramming, and performance." },
  { img: "/assets/img/best-product-3.jpg", category: "Database", name: "High Performance Postgres & Redis", price: "₹499.00", desc: "Query optimization, indexing strategies, and caching patterns." },
  { img: "/assets/img/featur-1.jpg", category: "Security", name: "Application Security & Zero-Trust", price: "₹520.00", desc: "Securing modern cloud APIs and microservices from threats." },
];

export default function ShopProducts() {
  return (
    <div className="col-lg-9">
      <div className="row g-4 justify-content-center">

        {products.map((product, i) => (
          <div key={i} className="col-md-6 col-lg-6 col-xl-4">
            <div className="rounded position-relative fruite-item border h-100 d-flex flex-column bg-white shadow-sm overflow-hidden">
              <div className="fruite-img" style={{ height: "200px", overflow: "hidden" }}>
                <img
                  src={product.img}
                  className="img-fluid w-100 h-100 rounded-top"
                  style={{ objectFit: "cover" }}
                  alt={product.name}
                />
              </div>
              <div
                className="text-white bg-primary px-3 py-1 rounded-pill position-absolute small font-weight-bold"
                style={{ top: 10, left: 10, fontSize: "0.75rem" }}
              >
                {product.category}
              </div>
              <div className="p-4 border-top-0 rounded-bottom text-start d-flex flex-column flex-grow-1">
                <h5 className="fs-6 fw-bold text-dark mb-1" title={product.name}>{product.name}</h5>
                <p className="text-muted small flex-grow-1">
                  {product.desc}
                </p>
                <div className="d-flex justify-content-between flex-lg-wrap align-items-center mt-3 pt-2 border-top">
                  <p className="text-dark fs-5 fw-bold mb-0">{product.price}</p>
                  <a
                    href="/cart"
                    className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                  >
                    <i className="fa fa-shopping-bag me-1 text-primary" />
                    Get Guide
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="col-12">
          <div className="pagination d-flex justify-content-center mt-5">
            <a href="#" className="rounded">&laquo;</a>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <a key={n} href="#" className={`rounded${n === 1 ? " active" : ""}`}>
                {n}
              </a>
            ))}
            <a href="#" className="rounded">&raquo;</a>
          </div>
        </div>

      </div>
    </div>
  );
}
