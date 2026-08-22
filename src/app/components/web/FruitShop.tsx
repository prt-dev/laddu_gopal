"use client";
import { useState } from "react";
import Link from "next/link";

interface Article {
  img: string;
  category: string;
  name: string;
  readTime: string;
  tab: string[];
  slug: string;
}

const articles: Article[] = [
  {
    img: "featur-1.jpg",
    category: "Tech & Architecture",
    name: "Architecting Modern Scalable Web Apps in 2026",
    readTime: "6 min read",
    tab: ["all", "tech"],
    slug: "architecting-modern-scalable-web-apps-2026",
  },
  {
    img: "featur-2.jpg",
    category: "AI & Engineering",
    name: "Autonomous Agents and the Evolution of Coding",
    readTime: "8 min read",
    tab: ["all", "tech", "ai"],
    slug: "autonomous-agents-evolution-of-coding",
  },
  {
    img: "featur-3.jpg",
    category: "Design & UX",
    name: "Building Resilient Design Systems for High Growth",
    readTime: "5 min read",
    tab: ["all", "design"],
    slug: "building-resilient-design-systems",
  },
  {
    img: "banner-fruits.jpg",
    category: "Startups & Growth",
    name: "Bootstrapping to $1M ARR: Lessons in Product Velocity",
    readTime: "7 min read",
    tab: ["all", "startups"],
    slug: "bootstrapping-to-1m-arr",
  },
  {
    img: "single-item.jpg",
    category: "Writing & Culture",
    name: "The Art of Clear Thinking and Long-Form Writing",
    readTime: "4 min read",
    tab: ["all", "culture"],
    slug: "art-of-clear-thinking-writing",
  },
  {
    img: "best-product-1.jpg",
    category: "Tech & DevOps",
    name: "Serverless Microservices and Distributed Caching",
    readTime: "9 min read",
    tab: ["all", "tech"],
    slug: "serverless-microservices-caching",
  },
  {
    img: "best-product-2.jpg",
    category: "Design & UX",
    name: "Micro-Interactions That Delight: A Designer's Guide",
    readTime: "5 min read",
    tab: ["all", "design"],
    slug: "micro-interactions-guide",
  },
  {
    img: "best-product-3.jpg",
    category: "AI & Future",
    name: "The Next Decade of Human-AI Collaborative Work",
    readTime: "6 min read",
    tab: ["all", "ai", "culture"],
    slug: "decade-of-human-ai-collaboration",
  },
];

const tabs = [
  { id: "all", label: "All Stories" },
  { id: "tech", label: "Tech & Cloud" },
  { id: "ai", label: "AI & Innovation" },
  { id: "design", label: "Design & UX" },
  { id: "startups", label: "Startups" },
];

export default function FruitShop() {
  const [activeTab, setActiveTab] = useState("all");
  const filtered = articles.filter((p) => p.tab.includes(activeTab));

  return (
    <div className="container-fluid fruite py-5">
      <div className="container py-5">
        <div className="tab-class text-center">
          {/* Header Row */}
          <div className="row g-4 align-items-center mb-4">
            <div className="col-lg-4 text-start">
              <h1 className="fw-bold mb-0">Curated Articles</h1>
            </div>
            <div className="col-lg-8 text-end">
              <ul className="nav nav-pills d-inline-flex text-center mb-0">
                {tabs.map((t) => (
                  <li className="nav-item" key={t.id}>
                    <a
                      href="#"
                      className={`d-flex m-2 py-2 px-3 bg-light rounded-pill${activeTab === t.id ? " active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(t.id);
                      }}
                    >
                      <span className={activeTab === t.id ? "text-white fw-bold" : "text-dark"} style={{ minWidth: "100px" }}>
                        {t.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="tab-content">
            <div className="tab-pane fade show p-0 active">
              <div className="row g-4">
                {filtered.map((p, i) => (
                  <div className="col-md-6 col-lg-4 col-xl-3" key={i}>
                    <div className="rounded position-relative fruite-item border h-100 d-flex flex-column bg-white shadow-sm overflow-hidden">
                      <div className="fruite-img" style={{ height: "200px", overflow: "hidden" }}>
                        <img
                          src={`/assets/img/${p.img}`}
                          className="img-fluid w-100 h-100 rounded-top"
                          style={{ objectFit: "cover" }}
                          alt={p.name}
                        />
                      </div>
                      <div
                        className="text-white bg-primary px-3 py-1 rounded-pill position-absolute small font-weight-bold"
                        style={{ top: "12px", left: "12px", fontSize: "0.75rem" }}
                      >
                        {p.category}
                      </div>
                      <div className="p-4 border-top-0 rounded-bottom text-start d-flex flex-column flex-grow-1">
                        <h5 className="fs-6 fw-bold text-dark mb-2" title={p.name} style={{ minHeight: "44px" }}>
                          {p.name}
                        </h5>
                        <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                          <span className="text-muted small">
                            <i className="fa fa-clock text-secondary me-1"></i>
                            {p.readTime}
                          </span>
                          <Link href={`/blog-preview?slug=${p.slug}`} className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">
                            Read &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
