import { siteConfig } from "../../config/site";

export default function ContactSection() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8">
      <div className="rounded border border-[#fff0ad] bg-white p-6 sm:p-8">
        <h2 className="heading-font text-2xl font-bold text-[#d20b4f] text-center mb-2">
          Get in Touch with {siteConfig.name}
        </h2>
        <p className="text-sm text-black text-center max-w-xl mx-auto mb-8">
          Have questions about customized Laddu Gopal poshak sizes, bulk orders, or dispatching worldwide? Reach out to us anytime!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-[#fff0ad] p-6 rounded">
            <h3 className="heading-font text-lg font-bold text-[#d20b4f] mb-4">
              Send a Message
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1">Your Full Name</label>
                <input
                  type="text"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-[#d20b4f] focus:outline-hidden"
                  placeholder="e.g. Radhika Sharma"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-[#d20b4f] focus:outline-hidden"
                    placeholder="8013395004"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-[#d20b4f] focus:outline-hidden"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Your Message</label>
                <textarea
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-[#d20b4f] focus:outline-hidden"
                  rows={4}
                  placeholder="Please describe your requirements..."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded bg-[#d20b4f] py-2.5 text-sm font-bold text-black transition hover:bg-[#b80943] border-0 cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded border border-[#fff0ad] bg-[#fff0ad] p-5">
              <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-2">
                Contact Details :
              </h4>
              <p className="text-sm leading-[1.6] text-black mb-0">
                <strong>Phone Number -</strong> {siteConfig.phone1}
                <br />
                <strong>Whatsapp -</strong> {siteConfig.phone1}
                <br />
                <strong>Email -</strong> {siteConfig.email}
              </p>
            </div>

            <div className="rounded border border-[#fff0ad] bg-[#fff0ad] p-5">
              <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-2">
                Location Details :
              </h4>
              <p className="text-sm leading-[1.6] text-black mb-0">
                College More, Kanchrapara,
                <br />
                Kolkata, West Bengal
                <br />
                743145
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
