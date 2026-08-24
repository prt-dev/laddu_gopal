const features = [
  {
    icon: "fas fa-hands-praying",
    title: "Handcrafted Devotion",
    desc: "Exquisite zardozi, kundan & embroidery for Thakur Ji",
  },
  {
    icon: "fas fa-globe-americas",
    title: "Worldwide Devotee Dispatch",
    desc: "Delivering pure shringar items across India & globally",
  },
  {
    icon: "fas fa-ruler-combined",
    title: "Custom Size Options",
    desc: "Perfect fit from Size 0 up to Size 12 Bal Gopal idols",
  },
  {
    icon: "fas fa-star-and-crescent",
    title: "Sacred Quality & Purity",
    desc: "Curated with pure love as if offering to our own Thakur Ji",
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
