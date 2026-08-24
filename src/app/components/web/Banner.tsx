export default function Banner() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 my-8">
      <div className="rounded border border-[#fff0ad] bg-[#fff0ad] p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="heading-font text-2xl sm:text-3xl font-bold text-[#d20b4f] mb-3">
              Sacred Craftsmanship for Laddu Gopal
            </h2>
            <p className="text-sm font-bold text-black mb-6 leading-relaxed">
              Every poshak, pagdi, and kundan shringar item at Makhan Chor is lovingly handcrafted with sacred devotion for Thakur Ji.
            </p>
            <a
              href="/shop"
              className="rounded bg-[#d20b4f] px-6 py-2.5 text-sm font-bold text-black transition hover:bg-[#b80943] no-underline inline-block"
            >
              Explore Collection
            </a>
          </div>
          <div className="flex justify-center">
            <img
              src="/assets/best-selling.png"
              alt="Makhan Chor Collection"
              className="rounded max-h-60 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
