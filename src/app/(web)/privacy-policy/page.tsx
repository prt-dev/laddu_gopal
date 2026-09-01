import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Makhan Chor - Laddu Gopal",
  description:
    "Learn how Makhan Chor collects, protects, and handles your personal information, delivery addresses, and payment data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal", href: "#" },
          { label: "Privacy Policy" },
        ]}
      />

      <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6">
        <div className="mb-10 rounded-xl border border-[#d20b4f]/20 bg-[#fff0ad]/30 p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-block rounded bg-[#d20b4f] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                Data Protection & Privacy
              </span>
              <h2 className="heading-font mt-2 text-2xl font-bold text-[#d20b4f] sm:text-3xl">
                Your Privacy Is Sacred To Us
              </h2>
            </div>
            <p className="text-xs font-semibold text-gray-700">
              Last Updated: September 2026
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-800">
            At <strong>{siteConfig.name}</strong>, accessible via our online store, we are committed to safeguarding the personal information and trust of our devotees and customers. This Privacy Policy details the types of information we collect, how it is used, and the strict security measures we implement.
          </p>
        </div>

        <div className="space-y-8 text-gray-800">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                1
              </span>
              Information We Collect
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>When you register, browse, or place an order, we may collect the following details:</p>
              <ul className="list-inside list-disc space-y-1.5 pl-2">
                <li><strong>Personal Identity:</strong> Full Name, Email Address, and Phone/WhatsApp number.</li>
                <li><strong>Shipping Details:</strong> Delivery street address, city, state, postal pin code, and landmark.</li>
                <li><strong>Order History:</strong> Deity dress sizes ordered, transaction summaries, and invoice details.</li>
                <li><strong>Device &amp; Analytics:</strong> IP address, browser type, and interaction cookies to improve website speed and user experience.</li>
              </ul>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                2
              </span>
              Payment Security
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                <strong>We never store your sensitive financial information:</strong> All card numbers, CVVs, UPI PINs, and banking credentials are processed via RBI-authorized, encrypted payment gateways (e.g. Razorpay / Cashfree / Stripe).
              </p>
              <p>
                Our store uses industry-standard 256-bit SSL encryption to ensure all communications between your browser and our servers remain confidential and protected.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                3
              </span>
              How We Use Your Information
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>Your details are used strictly for:</p>
              <ul className="list-inside list-disc space-y-1.5 pl-2">
                <li>Processing and fulfilling your orders accurately.</li>
                <li>Sharing live dispatch tracking updates via SMS, WhatsApp, or email.</li>
                <li>Offering customer support regarding sizing, returns, or order modifications.</li>
                <li>Informing you about festival promotions (e.g., Janmashtami, Radhashtami, Diwali) if you have opted in.</li>
              </ul>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="heading-font flex items-center gap-2 text-xl font-bold text-[#d20b4f]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
                4
              </span>
              Third-Party Service Providers
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We share limited delivery information (such as Name, Phone Number, and Address) solely with trusted courier partners (e.g. Shiprocket, BlueDart, DTDC, India Post) to facilitate doorstep delivery.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-[#d20b4f]/20 bg-[#fff0ad]/20 p-6 sm:p-8">
            <h3 className="heading-font text-xl font-bold text-[#d20b4f]">
              Contact Our Privacy Officer
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              If you have inquiries about how your data is handled or would like to request data deletion, contact us at:
            </p>
            <p className="mt-3 text-sm font-semibold text-black">
              Email:{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-[#d20b4f] underline hover:text-[#b80943]">
                {siteConfig.email}
              </a>
              <br />
              Address: {siteConfig.address}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
