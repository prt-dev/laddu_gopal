export default function Banner() {
  return (
    <div className="container-fluid banner bg-secondary my-5">
      <div className="container py-5">
        <div className="row g-4 align-items-center">
          {/* Left: Text */}
          <div className="col-lg-7">
            <div className="py-4">
              <h1 className="display-4 text-white fw-bold">Publish Your Story on BlogVerse</h1>
              <p className="fw-normal display-6 text-dark mb-4">Reach Millions of Curious Readers Worldwide</p>
              <p className="mb-4 text-dark fs-5">
                Whether you write about software engineering, startup adventures, design philosophy, or life experiences, BlogVerse gives you the audience and distribution you deserve.
              </p>
              <a href="/login" className="banner-btn btn border-2 border-white rounded-pill text-dark py-3 px-5 fw-bold me-3">
                START WRITING
              </a>
              <a href="/shop" className="btn btn-outline-dark rounded-pill py-3 px-4 fw-bold">
                EXPLORE STORIES
              </a>
            </div>
          </div>

          {/* Right: Image with stats badge */}
          <div className="col-lg-5">
            <div className="position-relative">
              <img src="/assets/img/featur-1.jpg" className="img-fluid w-100 rounded shadow-lg" style={{ height: "320px", objectFit: "cover" }} alt="Publish on BlogVerse" />
              <div
                className="d-flex align-items-center justify-content-center bg-white rounded-circle position-absolute shadow"
                style={{ width: "130px", height: "130px", top: -20, left: -20 }}
              >
                <div className="d-flex flex-column text-center">
                  <span className="h4 mb-0 fw-bold text-primary">50K+</span>
                  <span className="small text-muted mb-0">Authors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
