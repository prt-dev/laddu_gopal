export default function AboutSection() {
  return (
    <section className="mx-auto flex max-w-[1000px] flex-col gap-8 px-8 py-16 md:flex-row md:items-center">
      <div className="flex-1">
        <h2 className="heading-font text-xl font-bold">
          About Us
        </h2>

        <p className="mt-6 leading-[1.4]">
          Supplying All over
          <br />
          the Globe to
          <br />
          <span className="text-[#d20b4f]">
            Krishna Bhakts.
          </span>
        </p>

        <p className="mt-5 leading-[1.4]">
          We at Makhan Chor
          <br />
          are devotee of Krishna Ji and
          <br />
          personally have a hand in
          <br />
          curating every collection.
        </p>

        <p className="mt-5 leading-[1.4]">
          What reaches your home is what
          <br />
          we&apos;d offer our own Laddu Gopal.
        </p>
      </div>

      <div className="flex flex-1 justify-center">
        <img
          src="/assets/about-globe.png"
          alt="Worldwide Krishna devotees"
          className="w-[150px] object-contain"
        />
      </div>
    </section>
  );
}
