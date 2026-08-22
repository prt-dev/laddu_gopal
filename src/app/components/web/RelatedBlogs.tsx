import React from "react";
import Link from "next/link";
import { BlogItem } from "@/app/services/blogService";
import { getFullImageUrl } from "@/app/utils/utils";

interface RelatedBlogsProps {
  blogs?: BlogItem[];
}

const defaultRelated = [
  {
    title: "10 Key Innovations in Modern Web Architecture",
    excerpt: "How server components, streaming SSR, and edge execution loops are reshaping web performance.",
    date: "Aug 12, 2026",
    image: "/assets/img/featur-1.jpg",
    slug: "modern-web-architecture",
  },
  {
    title: "Building Production Multi-Agent Systems in 2026",
    excerpt: "Designing resilient tool sandboxes and deterministic supervisor agents with distributed memory.",
    date: "Aug 08, 2026",
    image: "/assets/img/featur-2.jpg",
    slug: "ai-agent-engineering",
  },
  {
    title: "Design Systems at Scale: Tokens & Fluid Typography",
    excerpt: "Constructing accessible and delightful user interfaces with harmonious design tokens.",
    date: "Aug 02, 2026",
    image: "/assets/img/featur-3.jpg",
    slug: "design-systems-scale",
  },
];

export default function RelatedBlogs({ blogs = [] }: RelatedBlogsProps) {
  const items = blogs.length > 0 ? blogs.slice(0, 3) : defaultRelated;

  return (
    <div className="mt-5 pt-4">
      <h3 className="fw-bold text-dark mb-4">Related Insights &amp; Articles</h3>
      <div className="row g-4">
        {items.map((item, idx) => (
          <div key={idx} className="col-md-4">
            <div className="card h-100 border rounded shadow-sm overflow-hidden">
              <img
                src={
                  (item as any).featured_image
                    ? getFullImageUrl((item as any).featured_image)
                    : (item as any).image || "/assets/img/featur-1.jpg"
                }
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
                alt={item.title}
              />
              <div className="card-body d-flex flex-column">
                <span className="text-muted small mb-2">
                  <i className="fa fa-calendar-alt text-primary me-1" />
                  {(item as any).published_at
                    ? new Date((item as any).published_at).toLocaleDateString()
                    : (item as any).date || "August 2026"}
                </span>
                <h5 className="card-title fw-bold text-dark mb-2">
                  <Link
                    href={`/blog-preview?slug=${item.slug || ""}`}
                    className="text-dark text-decoration-none"
                  >
                    {item.title}
                  </Link>
                </h5>
                <p className="card-text text-muted small flex-grow-1 line-clamp-2">
                  {item.excerpt}
                </p>
                <Link
                  href={`/blog-preview?slug=${item.slug || ""}`}
                  className="btn btn-sm btn-outline-primary rounded-pill mt-3 align-self-start"
                >
                  Read Article &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
