const facts = [
  { icon: "fas fa-newspaper", label: "Published Articles", value: "50,000+" },
  { icon: "fas fa-users", label: "Monthly Readers", value: "1.2M+" },
  { icon: "fas fa-pen-nib", label: "Top Authors", value: "4,500+" },
  { icon: "fas fa-bolt", label: "Platform Uptime", value: "99.9%" },
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
