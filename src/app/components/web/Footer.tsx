import { siteConfig } from "../../config/site";

export default function Footer() {
  return (
    <>
      {/* Footer */}
      <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
        <div className="container py-5">
          {/* Top Row: Brand, Newsletter, Socials */}
          <div className="pb-4 mb-4" style={{ borderBottom: "1px solid rgba(226, 175, 24, 0.5)" }}>
            <div className="row g-4 align-items-center">
              <div className="col-lg-3">
                <a href="/" className="text-decoration-none">
                  <h1 className="text-primary mb-0 fw-bold d-flex align-items-center">
                    <i className="fas fa-feather-alt text-secondary me-2"></i>
                    {siteConfig.name}
                  </h1>
                  <p className="text-secondary mb-0">Stories &amp; Digital Publishing</p>
                </a>
              </div>
              <div className="col-lg-6">
                <div className="position-relative mx-auto">
                  <input
                    className="form-control border-0 w-100 py-3 px-4 rounded-pill"
                    type="email"
                    placeholder="Enter your Email for Weekly Curated Stories"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary border-0 border-secondary py-3 px-4 position-absolute rounded-pill text-white fw-bold"
                    style={{ top: 0, right: 0 }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="d-flex justify-content-end pt-3">
                  <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href="#" target="_blank" rel="noreferrer">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href="#">
                    <i className="fab fa-github"></i>
                  </a>
                  <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a className="btn btn-outline-secondary btn-md-square rounded-circle" href="#">
                    <i className="fab fa-discord"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">About BlogVerse</h4>
                <p className="mb-4">
                  A modern storytelling &amp; technology publishing platform empowering thinkers, engineers, designers, and creators worldwide.
                </p>
                <a href="/shop" className="btn border-secondary py-2 px-4 rounded-pill text-primary fw-bold">Explore Stories</a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Topics &amp; Tracks</h4>
                {["Software Architecture", "Artificial Intelligence", "Design & UX Patterns", "Startup Playbooks", "Cloud & DevOps", "Writing & Culture"].map((l) => (
                  <a key={l} className="btn-link" href="/shop">{l}</a>
                ))}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Quick Links</h4>
                {["Home", "Blog Preview", "Editorial Guidelines", "Author Program", "Privacy Policy", "Terms of Service"].map((l) => (
                  <a key={l} className="btn-link" href="#">{l}</a>
                ))}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">Editorial Desk</h4>
                <p><i className="fas fa-map-marker-alt text-primary me-2"></i>{siteConfig.address}</p>
                <p><i className="fas fa-envelope text-primary me-2"></i>{siteConfig.email}</p>
                <p><i className="fas fa-phone-alt text-primary me-2"></i>{siteConfig.phone1}</p>
                <p><i className="fas fa-phone-alt text-primary me-2"></i>{siteConfig.phone2}</p>
                <p className="mt-2 text-light small">Open 24/7 for Reader &amp; Author Submissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container-fluid copyright bg-dark py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <span className="text-light">
                <a href="/">
                  <i className="fas fa-copyright text-light me-2"></i>{siteConfig.name}
                </a>
                , All rights reserved.
              </span>
            </div>
            <div className="col-md-6 my-auto text-center text-md-end text-white">
              Modern Storytelling &amp; Digital Publishing Platform
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
