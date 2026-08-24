const testimonials = [
  {
    text: "The Laddu Gopal poshak and Pagdi were beyond divine! The embroidery work is so delicate and pure. Thakur Ji looks so blissful in this shringar. Hare Krishna!",
    name: "Radhika Sharma",
    location: "Vrindavan / Delhi",
    stars: 5,
  },
  {
    text: "We ordered complete Kundan Mukut and Haar sets from Makhan Chor. The packaging and finishing are pristine. Truly feels blessed to offer this to our Laddu Gopal.",
    name: "Aman Agarwal",
    location: "Kolkata, WB",
    stars: 5,
  },
  {
    text: "Being in the UK, getting genuine, perfectly sized Laddu Gopal poshak was always challenging until we found Makhan Chor. Fast delivery and exceptional craftsmanship!",
    name: "Pooja Patel",
    location: "London, UK",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-[1100px] px-5 py-12">
      <div className="text-center mb-8">
        <span className="heading-font text-xs font-bold text-[#d20b4f] bg-[#fff0ad] px-3 py-1 rounded-full uppercase tracking-wider">
          🕉️ Devotee Reviews
        </span>
        <h2 className="heading-font text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          Love from Krishna Bhakts
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mt-1">
          Hear what devotees across India and around the globe share about their seva experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-[#fff0ad] bg-[#fff0ad]/15 p-6 shadow-xs transition hover:shadow-md hover:border-[#d20b4f]/30"
          >
            <div>
              <div className="flex gap-1 text-[#d20b4f] mb-3">
                {Array.from({ length: t.stars }, (_, j) => (
                  <i key={j} className="fas fa-star text-xs"></i>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#d20b4f]/10">
              <h4 className="heading-font text-sm font-bold text-gray-900 mb-0">
                {t.name}
              </h4>
              <p className="text-[11px] text-gray-500 mb-0">
                {t.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
