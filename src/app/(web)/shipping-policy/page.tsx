import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Makhan Chor - Laddu Gopal",
  description:
    "Review shipping rates, transit times, pan-India courier delivery, and packaging safety for Makhan Chor orders.",
};

export default function ShippingPolicyPage() {
  return (
    <>
      <PageHeader
        title="Shipping & Delivery Policy"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Customer Care", href: "#" },
          { label: "Shipping Policy" },
        ]}
      />

      <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6">
        <div className="mb-10 rounded-xl border border-[#d20b4f]/20 bg-[#fff0ad]/30 p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-block rounded bg-[#d20b4f] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                Safe &amp; Sacred Packaging
              </span>
              <h2 className="heading-font mt-2 text-2xl font-bold text-[#d20b4f] sm:text-3xl">
                Pan-India &amp; Global Shipping Guidelines
              </h2>
            </div>
            <p className="text-xs font-semibold text-gray-700">
              Last Updated: September 2026
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-800">
            We deliver handcrafted Laddu Gopal poshaks, crowns, jewellery, and devotional decor safely across all pin codes in India and select international destinations. Here is everything you need to know about our shipping speeds, tracking, and protective packaging.
          </p>
        </div>

        <div className="space-y-8 text-gray-800">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                1
              </span>
              Order Processing Times
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                <strong>Ready-to-Ship Items:</strong> Orders for in-stock poshaks, pagdis, and shringar accessories are carefully inspected, sanitized, and dispatched within <strong>24 to 48 hours</strong> of order confirmation.
              </p>
              <p>
                <strong>Custom &amp; Festival Heavy Poshaks:</strong> Special customized deity dresses or intricate heavy zardozi creations may take <strong>3 to 5 business days</strong> for hand-tailoring before dispatch.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                2
              </span>
              Estimated Delivery Timelines
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <ul className="list-inside list-disc space-y-2 pl-2">
                <li><strong>Metro Cities (Kolkata, Delhi, Mumbai, Bengaluru, Chennai, Hyderabad):</strong> 2 to 4 business days post-dispatch.</li>
                <li><strong>Rest of India (Tier 2/3 Cities &amp; Districts):</strong> 4 to 7 business days post-dispatch.</li>
                <li><strong>Remote Locations / North East / J&amp;K:</strong> 6 to 9 business days via India Post Speed Post or specialized courier.</li>
              </ul>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                3
              </span>
              Live Tracking &amp; Courier Partners
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                As soon as your package is dispatched, you will receive an SMS and WhatsApp alert containing the direct courier tracking URL and AWB tracking number.
              </p>
              <p>
                We partner with premier courier networks including Delhivery, BlueDart, DTDC, XpressBees, and India Post Speed Post.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-[#d20b4f]/20 bg-[#fff0ad]/20 p-6 sm:p-8">
            <h3 className="heading-font text-xl font-bold text-[#d20b4f]">
              Need Urgent Festival Delivery?
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              If you require fast-track delivery for an upcoming festival, puja, or celebration, please contact our helpline on WhatsApp before placing your order:
            </p>
            <div className="mt-4">
              <a
                href={`https://wa.me/91${siteConfig.phone1}?text=Hi%20Makhan%20Chor,%20I%20need%20urgent%20express%20delivery%20for%20my%20order`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#1EBE5D] no-underline"
              >
                <span>💬 WhatsApp Express Support (+91 {siteConfig.phone1})</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
