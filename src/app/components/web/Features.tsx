const features = [
  {
    icon: "fas fa-feather-alt",
    title: "Curated Editorial",
    desc: "Hand-picked articles from top industry experts",
  },
  {
    icon: "fas fa-globe-americas",
    title: "Global Writer Network",
    desc: "Stories from tech leaders and creative thinkers",
  },
  {
    icon: "fas fa-book-reader",
    title: "Distraction-Free Reading",
    desc: "Clean typography and seamless reading experience",
  },
  {
    icon: "fas fa-rocket",
    title: "Instant Publishing & SEO",
    desc: "Powerful CMS tools and search optimization",
  },
];

export default function Features() {
  return (
    <div className="container-fluid featurs py-5">
      <div className="container py-5">
        <div className="row g-4">
          {features.map((f, i) => (
            <div className="col-md-6 col-lg-3" key={i}>
              <div className="featurs-item text-center rounded bg-light p-4">
                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                  <i className={`${f.icon} fa-3x text-white`}></i>
                </div>
                <div className="featurs-content text-center">
                  <h5>{f.title}</h5>
                  <p className="mb-0">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
