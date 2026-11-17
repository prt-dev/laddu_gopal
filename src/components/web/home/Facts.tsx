const facts = [
  { icon: "fas fa-heart", label: "Happy Devotees", value: "10,000+" },
  { icon: "fas fa-vest-patches", label: "Poshak Designs", value: "500+" },
  { icon: "fas fa-globe", label: "Countries Shipped", value: "25+" },
  { icon: "fas fa-certificate", label: "Pure Devotion", value: "100%" },
];

export default function Facts() {
  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="bg-light p-5 rounded">
          <div className="row g-4 justify-content-center">
            {facts.map((f, i) => (
              <div className="col-md-6 col-lg-6 col-xl-3" key={i}>
                <div className="counter bg-white rounded p-5 text-center">
                  <i className={`${f.icon} text-secondary fa-2x mb-3`}></i>
                  <h4>{f.label}</h4>
                  <h1>{f.value}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
