import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../../components/web/PageHeader";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Makhan Chor - Laddu Gopal",
  description:
    "Learn about our refund, return, and cancellation policies for Laddu Gopal poshaks, pagdis, and devotional accessories.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <PageHeader
        title="Refund & Cancellation Policy"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Customer Care", href: "#" },
          { label: "Refund Policy" },
        ]}
      />

      <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6">
        {/* Policy Highlight Banner */}
        <div className="mb-10 rounded-xl border border-[#d20b4f]/20 bg-[#fff0ad]/30 p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-block rounded bg-[#d20b4f] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                Devotee Satisfaction Guarantee
              </span>
              <h2 className="heading-font mt-2 text-2xl font-bold text-[#d20b4f] sm:text-3xl">
                Transparent Returns &amp; Hassle-Free Refunds
              </h2>
            </div>
            <p className="text-xs font-semibold text-gray-700">
              Last Updated: September 2026
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-800">
            At <strong>{siteConfig.name}</strong>, we take extreme pride in handcrafting each Laddu Gopal poshak, pagdi, and divine ornament with supreme devotion. We understand that deity dressing requires precision in size and design. Here is our comprehensive return, exchange, and refund policy to ensure you shop with peace of mind.
          </p>
        </div>

        {/* 4 Quick Highlights Cards */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#d20b4f]/20 bg-white p-5 text-center shadow-xs transition hover:shadow-md">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0ad] text-2xl">
              ⏱️
            </div>
            <h4 className="heading-font text-base font-bold text-[#d20b4f]">
              48-Hour Notice
            </h4>
            <p className="mt-1 text-xs text-gray-600">
              Report damaged or incorrect items within 48 hours of parcel delivery.
            </p>
          </div>

          <div className="rounded-xl border border-[#d20b4f]/20 bg-white p-5 text-center shadow-xs transition hover:shadow-md">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0ad] text-2xl">
              📦
            </div>
            <h4 className="heading-font text-base font-bold text-[#d20b4f]">
              Unboxing Video
            </h4>
            <p className="mt-1 text-xs text-gray-600">
              A 360° unboxing video is required to claim transit damages or missing parts.
            </p>
          </div>

          <div className="rounded-xl border border-[#d20b4f]/20 bg-white p-5 text-center shadow-xs transition hover:shadow-md">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0ad] text-2xl">
              💳
            </div>
            <h4 className="heading-font text-base font-bold text-[#d20b4f]">
              5–7 Day Refunds
            </h4>
            <p className="mt-1 text-xs text-gray-600">
              Approved refunds are credited back to the original payment method in 5–7 business days.
            </p>
          </div>

          <div className="rounded-xl border border-[#d20b4f]/20 bg-white p-5 text-center shadow-xs transition hover:shadow-md">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0ad] text-2xl">
              💬
            </div>
            <h4 className="heading-font text-base font-bold text-[#d20b4f]">
              WhatsApp Help
            </h4>
            <p className="mt-1 text-xs text-gray-600">
              Direct assistance via WhatsApp on {siteConfig.phone1} for fast resolution.
            </p>
          </div>
        </div>

        {/* Detailed Policy Sections */}
        <div className="space-y-8 text-gray-800">
          {/* Section 1: Cancellation Policy */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                1
              </span>
              Order Cancellation Policy
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                <strong>Before Dispatch:</strong> You may cancel your order free of charge before the item has been dispatched or handed over to our shipping courier. To cancel, please message us immediately on WhatsApp ({siteConfig.phone1}) or email {siteConfig.email} with your Order ID.
              </p>
              <p>
                <strong>After Dispatch:</strong> Once your sacred order is packed and dispatched with a courier tracking ID, it cannot be cancelled directly. You may choose to refuse the delivery upon arrival; return shipping deductions may apply in non-defective cases.
              </p>
              <p>
                <strong>Custom Made Orders:</strong> Customized deity dresses or special-order items that have already entered the craftsmanship phase cannot be cancelled.
              </p>
            </div>
          </section>

          {/* Section 2: Returns & Exchanges */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                2
              </span>
              Eligibility for Returns &amp; Replacements
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>We provide a <strong>free replacement or full refund</strong> under the following circumstances:</p>
              <ul className="list-inside list-disc space-y-2 pl-2">
                <li>
                  <strong>Transit Damage:</strong> If the idol, crown (pagdi), or jewellery arrives cracked, bent, or damaged during transit.
                </li>
                <li>
                  <strong>Wrong Item Received:</strong> If the design, color, or deity size sent to you does not match your confirmed order.
                </li>
                <li>
                  <strong>Missing Accessories:</strong> If any part of a multi-piece shringar set or poshak accessory is missing from the sealed package.
                </li>
              </ul>
              <div className="mt-3 rounded-lg bg-[#fff0ad]/40 p-4 border border-[#d20b4f]/20">
                <p className="font-bold text-[#d20b4f]">⚠️ Mandatory Unboxing Video Guideline:</p>
                <p className="mt-1 text-xs text-gray-800">
                  Because sacred items are fragile and meticulously verified before dispatch, an uncut, continuous 360-degree unboxing video recorded from the moment the outer parcel seal is opened is <strong>mandatory</strong> to process transit damage claims.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Non-Returnable Items */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                3
              </span>
              Non-Returnable &amp; Non-Refundable Items
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>Due to the sacred and personal nature of devotional items, the following are non-returnable:</p>
              <ul className="list-inside list-disc space-y-1.5 pl-2">
                <li>Items that have already been placed in puja rituals, washed, or altered.</li>
                <li>Items returned without original tags, boxes, or protective packaging.</li>
                <li>Customized poshaks made to specific non-standard deity measurements upon custom request.</li>
                <li>Clearance or festival clearance sale items explicitly marked non-returnable.</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Size Exchange Guidelines */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                4
              </span>
              Laddu Gopal Size Exchange Guidance
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                We want your Laddu Gopal ji to look perfect. If you mistakenly ordered the wrong size (for instance, Size 2 instead of Size 4), you may request a size exchange within <strong>3 days</strong> of delivery, provided the item is unused in original packaging.
              </p>
              <p>
                In case of customer size preference changes, a nominal reverse pickup fee (or self-courier requirement) may apply depending on your location.
              </p>
            </div>
          </section>

          {/* Section 5: Refund Mode & Timeline */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                5
              </span>
              Refund Processing &amp; Timelines
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                Once the returned item is received at our facility and passes physical inspection:
              </p>
              <ul className="list-inside list-disc space-y-2 pl-2">
                <li>
                  <strong>Prepaid Orders (UPI/Cards/Net Banking):</strong> The refund is initiated immediately and credited to your original payment method within <strong>5 to 7 business days</strong> (depending on your bank).
                </li>
                <li>
                  <strong>Cash on Delivery (COD) Orders:</strong> Refunds for verified COD returns are transferred securely via UPI (Google Pay, PhonePe, Paytm) or direct NEFT/IMPS bank transfer as provided by the customer.
                </li>
                <li>
                  <strong>Store Credit / Gift Vouchers:</strong> If you prefer, store credit can be issued instantly for faster future orders.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: How to Request */}
          <section className="rounded-xl border border-[#d20b4f]/20 bg-[#fff0ad]/20 p-6 shadow-xs sm:p-8">
            <h3 className="heading-font text-xl font-bold text-[#d20b4f]">
              How to Initiate a Return or Refund
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              Follow these simple steps for quick resolution:
            </p>
            <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm text-gray-800">
              <li>
                Take clear photos of the parcel label and a short video showing the unboxing / defect.
              </li>
              <li>
                Send a WhatsApp message to{" "}
                <a
                  href={`https://wa.me/91${siteConfig.phone1}?text=Hi%20Makhan%20Chor,%20I%20need%20assistance%20with%20my%20order%20return/refund`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#d20b4f] underline hover:text-[#b80943]"
                >
                  +91 {siteConfig.phone1}
                </a>{" "}
                or email{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-bold text-[#d20b4f] underline hover:text-[#b80943]"
                >
                  {siteConfig.email}
                </a>{" "}
                with your Order ID.
              </li>
              <li>
                Our team will verify the request within 24 hours and arrange a replacement or reverse pickup.
              </li>
            </ol>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={`https://wa.me/91${siteConfig.phone1}?text=Hi%20Makhan%20Chor,%20I%20have%20a%20query%20about%20my%20order%20return`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#1EBE5D] no-underline"
              >
                <span>💬 Chat on WhatsApp (+91 {siteConfig.phone1})</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-[#d20b4f] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#b80943] no-underline"
              >
                <span>Contact Support Page</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
