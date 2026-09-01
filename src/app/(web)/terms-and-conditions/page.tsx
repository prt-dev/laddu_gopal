import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../../components/web/PageHeader";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = {
  title: "Terms & Conditions | Makhan Chor - Laddu Gopal",
  description:
    "Review the terms of service, purchasing guidelines, order policies, and conditions for Makhan Chor Laddu Gopal devotional store.",
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageHeader
        title="Terms & Conditions"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal", href: "#" },
          { label: "Terms & Conditions" },
        ]}
      />

      <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6">
        {/* Intro banner */}
        <div className="mb-10 rounded-xl border border-[#d20b4f]/20 bg-[#fff0ad]/30 p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-block rounded bg-[#d20b4f] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                Legal Agreement
              </span>
              <h2 className="heading-font mt-2 text-2xl font-bold text-[#d20b4f] sm:text-3xl">
                Terms & Conditions of Service
              </h2>
            </div>
            <p className="text-xs font-semibold text-gray-700">
              Last Updated: September 2026
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-800">
            Welcome to <strong>{siteConfig.name}</strong>. By browsing, accessing, or placing an order through our website, you agree to comply with and be bound by the following terms, conditions, and store policies. Please read them carefully before making any purchases of our devotional dresses (poshaks), pagdis, jewellery, and shringar accessories.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 text-gray-800">
          {/* Section 1 */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                1
              </span>
              Acceptance of Terms
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                By visiting our website and/or purchasing from us, you engage in our &quot;Service&quot; and agree to be bound by these Terms and Conditions (&quot;Terms of Service&quot;, &quot;Terms&quot;), including any additional terms and policies referenced herein or available via hyperlink.
              </p>
              <p>
                These Terms apply to all visitors, registered devotees, customers, merchants, and contributors of content. If you do not agree with any part of these terms, you may not access the website or use our services.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                2
              </span>
              Handcrafted Products & Representation
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                All Laddu Gopal poshaks, pagdis, kundan shringar, and deity ornaments showcased on <strong>{siteConfig.name}</strong> are handcrafted with reverence by skilled artisans.
              </p>
              <ul className="list-inside list-disc space-y-2 pl-2">
                <li>
                  <strong>Handcrafted Nuances:</strong> Due to individual hand-embroidery, stone placement, and zari work, minor natural variations in embellishments, colour tones, or thread styling may occur. These are considered hallmarks of authentic craftsmanship.
                </li>
                <li>
                  <strong>Display Colours:</strong> We make every effort to display the colours and textures of our items accurately. However, variations may occur depending on your monitor or phone screen settings.
                </li>
                <li>
                  <strong>Deity Sizing:</strong> Sizing for Laddu Gopal (Size 0 to Size 8+) is standardized based on deity idol measurements. Please consult our size charts or reach out for guidance prior to ordering.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                3
              </span>
              Pricing, Currency & Payment Terms
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                All prices listed on the site are in <strong>Indian Rupees ({siteConfig.currency})</strong> and include applicable taxes unless specified otherwise.
              </p>
              <ul className="list-inside list-disc space-y-2 pl-2">
                <li>
                  We reserve the right to revise prices, product offerings, discounts, and promotional rates at any time without prior notice.
                </li>
                <li>
                  We accept secure online payments via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and authorized payment gateways.
                </li>
                <li>
                  Cash on Delivery (COD), when available, may be subject to a nominal verification check or convenience fee based on delivery pin code.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                4
              </span>
              Orders, Acceptance & Cancellations
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                Upon placing an order, you will receive an order confirmation via email/SMS. Order confirmation signifies receipt of your request, but does not constitute final binding acceptance.
              </p>
              <p>
                We reserve the right to cancel or limit quantities on any order for reasons including inventory unavailability, inaccuracies in pricing or descriptions, address deliverability issues, or suspected fraudulent activity. In such instances, any payment already collected will be refunded promptly.
              </p>
              <p>
                For details on customer-initiated cancellations and refund terms, please consult our{" "}
                <Link
                  href="/refund-policy"
                  className="font-bold text-[#d20b4f] underline hover:text-[#b80943]"
                >
                  Refund &amp; Cancellation Policy
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                5
              </span>
              Intellectual Property Rights
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                All trademarks, logos, brand names, product photographs, text content, software codes, and artwork displayed on this website are the intellectual property of <strong>{siteConfig.name}</strong> or its content providers.
              </p>
              <p>
                You may not reproduce, copy, duplicate, sell, or exploit any portion of our designs, images, or branding without prior express written permission from our management.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                6
              </span>
              User Conduct & Prohibited Uses
            </h3>
            <div className="mt-4 space-y-2 text-sm leading-relaxed text-gray-700">
              <p>You agree not to use our website or its content:</p>
              <ul className="list-inside list-disc space-y-1.5 pl-2">
                <li>For any unlawful or unauthorized devotional or commercial purpose.</li>
                <li>To violate any international, national, or state regulations, laws, or ordinances.</li>
                <li>To transmit malicious codes, viruses, worms, or disruptive scripts.</li>
                <li>To harvest personal information or initiate spamming activities.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                7
              </span>
              Limitation of Liability & Governing Law
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                {siteConfig.name}, its owners, partners, and employees shall not be held liable for any indirect, incidental, punitive, or consequential damages resulting from the use of products or services offered on this site.
              </p>
              <p>
                These Terms and any separate agreements shall be governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes arising shall be subject exclusively to the jurisdiction of courts in <strong>Kolkata / North 24 Parganas, West Bengal</strong>.
              </p>
            </div>
          </section>

          {/* Section 8: Support & Contact */}
          <section className="rounded-xl border border-[#d20b4f]/20 bg-[#fff0ad]/20 p-6 sm:p-8">
            <h3 className="heading-font text-xl font-bold text-[#d20b4f]">
              Questions or Grievances?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              If you have any questions or require clarification regarding these Terms &amp; Conditions, please reach out to our customer care team:
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-black">
              <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 border border-[#d20b4f]/20">
                <span className="text-[#d20b4f]">📞 Phone/WhatsApp:</span>
                <a href={`tel:${siteConfig.phone1}`} className="hover:text-[#d20b4f] no-underline">
                  {siteConfig.phone1}
                </a>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 border border-[#d20b4f]/20">
                <span className="text-[#d20b4f]">✉️ Email:</span>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-[#d20b4f] no-underline">
                  {siteConfig.email}
                </a>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 border border-[#d20b4f]/20">
                <span className="text-[#d20b4f]">📍 Address:</span>
                <span>{siteConfig.address}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
