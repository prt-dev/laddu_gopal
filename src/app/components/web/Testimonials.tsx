const testimonials = [
  {
    text: "BlogVerse has completely transformed how I discover technology insights and deep architectural essays. The quality of writing here is unmatched!",
    img: "avatar-1.jpg",
    name: "Alex Rivera",
    profession: "Staff Software Architect",
    stars: 5,
  },
  {
    text: "Publishing on BlogVerse gave my engineering articles tremendous reach. The markdown editor and analytics dashboard are pure joy to work with.",
    img: "avatar-1.jpg",
    name: "Sophia Chen",
    profession: "AI Research Lead & Writer",
    stars: 5,
  },
  {
    text: "The distraction-free reading mode and vibrant comments community make BlogVerse my morning daily destination for thoughtful reads.",
    img: "avatar-1.jpg",
    name: "Marcus Vance",
    profession: "Design Systems Director",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <div className="container-fluid testimonial py-5">
      <div className="container py-5">
        <div className="testimonial-header text-center">
          <h4 className="text-primary fw-bold">Community Voices</h4>
          <h1 className="display-5 mb-5 text-dark fw-bold">What Readers &amp; Authors Say</h1>
        </div>

        {/* Owl Carousel — items are rendered; carousel init happens via main.js */}
        <div className="owl-carousel testimonial-carousel">
          {testimonials.map((t, i) => (
            <div className="testimonial-item img-border-radius bg-light rounded p-4" key={i}>
              <div className="position-relative">
                <i
                  className="fa fa-quote-right fa-2x text-secondary position-absolute"
                  style={{ bottom: "30px", right: 0 }}
                ></i>
                <div className="mb-4 pb-4 border-bottom border-secondary">
                  <p className="mb-0">{t.text}</p>
                </div>
                <div className="d-flex align-items-center flex-nowrap">
                  {/* <div className="bg-secondary rounded">
                    <img
                      src={`/assets/img/${t.img}`}
                      className="img-fluid rounded"
                      style={{ width: "100px", height: "100px" }}
                      alt={t.name}
                    />
                  </div> */}
                  <div className="ms-4 d-block">
                    <h4 className="text-dark">{t.name}</h4>
                    <p className="m-0 pb-3">{t.profession}</p>
                    <div className="d-flex pe-5">
                      {Array.from({ length: 5 }, (_, j) => (
                        <i key={j} className={`fas fa-star${j < t.stars ? " text-primary" : ""}`}></i>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
