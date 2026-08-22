import React from "react";
import Link from "next/link";
import { ClientItem } from "@/app/services/clientService";
import { BlogItem } from "@/app/services/blogService";
import { getFullImageUrl } from "@/app/utils/utils";

interface BlogSidebarProps {
  client?: ClientItem | null;
  recentBlogs?: BlogItem[];
}

const defaultCategories = [
  { name: "Web & Frontend Architecture", count: 18 },
  { name: "Autonomous AI & LLMs", count: 24 },
  { name: "Backend, Cloud & Rust", count: 15 },
  { name: "Design Systems & UI/UX", count: 12 },
  { name: "Startup & Engineering Leadership", count: 9 },
];

const defaultTags = [
  "NextJS",
  "React",
  "TypeScript",
  "AI_Agents",
  "Cloud",
  "WebArchitecture",
  "DevOps",
  "OpenSource",
];

export default function BlogSidebar({ client, recentBlogs = [] }: BlogSidebarProps) {
  return (
    <div className="col-lg-4 col-xl-3">
      <div className="row g-4">
        {/* Search Widget */}
        <div className="col-12">
          <div className="input-group w-100 mx-auto d-flex">
            <input
              type="search"
              className="form-control p-3"
              placeholder="Search articles & stories..."
              aria-describedby="blog-search-btn"
            />
            <span id="blog-search-btn" className="input-group-text p-3">
              <i className="fa fa-search" />
            </span>
          </div>
        </div>

        {/* Client / Publisher Info Card */}
        {client && (
          <div className="col-12">
            <div className="p-4 rounded bg-light border">
              <h5 className="fw-bold mb-3 text-dark">Published By</h5>
              <div className="d-flex align-items-center mb-3">
                {client.logo ? (
                  <img
                    src={getFullImageUrl(client.logo)}
                    alt={client.name}
                    className="rounded me-3 bg-white p-1 border"
                    style={{ width: "55px", height: "55px", objectFit: "contain" }}
                  />
                ) : (
                  <div
                    className="rounded me-3 bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: "55px", height: "55px", fontSize: "22px" }}
                  >
                    {(client.name || "C").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h6 className="fw-bold mb-1 text-dark">{client.name}</h6>
                  {client.domain && (
                    <span className="badge bg-primary text-white" style={{ fontSize: "11px" }}>
                      {client.domain}
                    </span>
                  )}
                </div>
              </div>
              {client.default_meta_description && (
                <p className="text-muted small mb-3">{client.default_meta_description}</p>
              )}
              {client.website_url && (
                <a
                  href={client.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary w-100 rounded-pill"
                >
                  Visit Official Website <i className="fa fa-external-link-alt ms-1" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Categories Widget */}
        <div className="col-12">
          <div className="mb-4">
            <h4 className="fw-bold mb-3">Topics</h4>
            <ul className="list-unstyled fruite-categorie">
              {defaultCategories.map((cat, idx) => (
                <li key={idx} className="border-bottom py-2">
                  <div className="d-flex justify-content-between fruite-name">
                    <a href="#" className="text-secondary text-decoration-none">
                      <i className="fas fa-chevron-right me-2 text-primary small" />
                      {cat.name}
                    </a>
                    <span className="text-muted">({cat.count})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Posts Widget */}
        <div className="col-12">
          <h4 className="fw-bold mb-3">Recent Stories</h4>
          {recentBlogs.length > 0 ? (
            recentBlogs.slice(0, 4).map((post, idx) => (
              <div key={idx} className="d-flex align-items-center mb-3">
                <img
                  src={
                    post.featured_image
                      ? getFullImageUrl(post.featured_image)
                      : "/assets/img/featur-1.jpg"
                  }
                  className="img-fluid rounded me-3"
                  style={{ width: "70px", height: "70px", objectFit: "cover" }}
                  alt={post.title || "Recent post"}
                />
                <div>
                  <h6 className="mb-1 text-truncate" style={{ maxWidth: "160px" }}>
                    <Link
                      href={`/blog-preview?slug=${post.slug || ""}`}
                      className="text-dark text-decoration-none"
                    >
                      {post.title}
                    </Link>
                  </h6>
                  <span className="text-muted small">
                    <i className="fa fa-calendar-alt me-1 text-primary" />
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : "Aug 2026"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="d-flex align-items-center mb-3">
                <img
                  src="/assets/img/featur-1.jpg"
                  className="img-fluid rounded me-3"
                  style={{ width: "70px", height: "70px", objectFit: "cover" }}
                  alt="Recent post"
                />
                <div>
                  <h6 className="mb-1 text-truncate" style={{ maxWidth: "160px" }}>
                    <a href="#" className="text-dark text-decoration-none">
                      Building High-Throughput APIs
                    </a>
                  </h6>
                  <span className="text-muted small">
                    <i className="fa fa-calendar-alt me-1 text-primary" />
                    Aug 15, 2026
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <img
                  src="/assets/img/featur-2.jpg"
                  className="img-fluid rounded me-3"
                  style={{ width: "70px", height: "70px", objectFit: "cover" }}
                  alt="Recent post"
                />
                <div>
                  <h6 className="mb-1 text-truncate" style={{ maxWidth: "160px" }}>
                    <a href="#" className="text-dark text-decoration-none">
                      AI Agent Tool Sandboxing
                    </a>
                  </h6>
                  <span className="text-muted small">
                    <i className="fa fa-calendar-alt me-1 text-primary" />
                    Aug 10, 2026
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tags Cloud */}
        <div className="col-12">
          <h4 className="fw-bold mb-3">Popular Tags</h4>
          <div className="d-flex flex-wrap gap-2">
            {defaultTags.map((tag, idx) => (
              <a
                key={idx}
                href="#"
                className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1"
                style={{ fontSize: "12px" }}
              >
                #{tag}
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter Banner */}
        <div className="col-12">
          <div
            className="rounded p-4 text-center text-white position-relative shadow-sm"
            style={{ background: "linear-gradient(135deg, #81c408, #619a03)" }}
          >
            <i className="fa fa-paper-plane fa-3x mb-3 text-white-50" />
            <h5 className="fw-bold mb-2">Subscribe to BlogVerse</h5>
            <p className="small mb-3">Get the latest technology insights &amp; editorial stories weekly.</p>
            <div className="input-group mb-2">
              <input
                type="email"
                className="form-control form-control-sm"
                placeholder="Your email address"
              />
              <button className="btn btn-dark btn-sm fw-bold">Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
