import Link from "next/link";
import { siteConfig } from "../../config/site";
import { RESOURCE_LINKS, POLICY_LINKS } from "../../config/links";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="mt-8 bg-[#fff0ad] px-6 py-10 border-t border-[#d20b4f]/15">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Contact Details */}
        <div>
          <h2 className="heading-font text-[21px] text-[#d20b4f] font-bold">
            Contact Details :
          </h2>

          <p className="mt-4 text-sm leading-[1.6] text-black">
            <strong>Phone:</strong> {siteConfig.phone1}
            <br />
            <strong>WhatsApp:</strong> {siteConfig.phone1}
            <br />
            <strong>Email:</strong> {siteConfig.email}
          </p>
        </div>

        {/* Resources */}
        <div id="blogs">
          <h2 className="heading-font text-[21px] text-[#d20b4f] font-bold">
            Resources :
          </h2>

          <div className="mt-4 space-y-2 text-sm leading-[1.6] text-black">
            {RESOURCE_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="block text-black hover:text-[#d20b4f] transition no-underline"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Customer Care & Policies */}
        <div>
          <h2 className="heading-font text-[21px] text-[#d20b4f] font-bold">
            Customer Care :
          </h2>

          <div className="mt-4 space-y-2 text-sm leading-[1.6] text-black">
            {POLICY_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="block text-black hover:text-[#d20b4f] transition no-underline"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Location Details */}
        <div>
          <h2 className="heading-font text-[21px] text-[#d20b4f] font-bold">
            Location Details :
          </h2>

          <p className="mt-4 text-sm leading-[1.6] text-black">
            College More, Kanchrapara,
            <br />
            Kolkata, West Bengal
            <br />
            Pin: 743145, India
          </p>
        </div>
      </div>

      {/* Bottom Legal Copyright Bar */}
      <div className="mx-auto mt-8 max-w-[1100px] border-t border-[#d20b4f]/20 pt-5 text-center text-xs text-gray-700">
        <p>
          &copy; {currentYear} <strong>{siteConfig.name}</strong>. All rights reserved. Handcrafted with devotion for Krishna Bhakts.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
          {POLICY_LINKS.map((link, idx) => (
            <span key={link.id} className="flex items-center gap-3">
              <Link href={link.href} className="text-gray-700 hover:text-[#d20b4f] transition no-underline">
                {link.name}
              </Link>
              {idx < POLICY_LINKS.length - 1 && <span className="text-gray-400">•</span>}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
