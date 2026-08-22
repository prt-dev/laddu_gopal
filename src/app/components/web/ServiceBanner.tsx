const services = [
  {
    img: "featur-1.jpg",
    bgClass: "bg-secondary",
    contentBg: "bg-primary",
    titleClass: "text-white",
    title: "Web Engineering Guides",
    offer: "Master Modern Frameworks",
  },
  {
    img: "featur-2.jpg",
    bgClass: "bg-dark",
    contentBg: "bg-light",
    titleClass: "text-primary",
    title: "AI & Autonomous Tech",
    offer: "Weekly Deep Dives",
  },
  {
    img: "featur-3.jpg",
    bgClass: "bg-primary",
    contentBg: "bg-secondary",
    titleClass: "text-white",
    title: "Design Systems & UX",
    offer: "Case Studies & Insights",
  },
];

export default function ServiceBanner() {
  return (
    <div className="container-fluid service py-5">
      <div className="container py-5">
        <div className="row g-4 justify-content-center">
          {services.map((s, i) => (
            <div className="col-md-6 col-lg-4" key={i}>
              <a href="#">
                <div className={`service-item ${s.bgClass} rounded border border-${s.bgClass.replace("bg-", "")}`}>
                  <img src={`/assets/img/agttools/${s.img}`} className="img-fluid rounded-top w-100" style={{ height: "220px", objectFit: "cover" }} alt={s.title} />
                  <div className="px-4 rounded-bottom">
                    <div className={`service-content ${s.contentBg} text-center p-4 rounded`}>
                      <h5 className={s.titleClass}>{s.title}</h5>
                      <h3 className="mb-0">{s.offer}</h3>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
