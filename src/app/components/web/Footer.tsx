import Link from "next/link";
import { siteConfig } from "../../config/site";

export default function Footer() {
  return (
    <footer id="contact" className="mt-8 bg-[#fff0ad] px-8 py-8">
      <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-8 sm:grid-cols-2">
        {/* Contact */}
        <div>
          <h2 className="heading-font text-[23px] text-[#d20b4f] font-bold">
            Contact Details :
          </h2>

          <p className="mt-6 text-sm leading-[1.5] text-black">
            Phone Number - {siteConfig.phone1}
            <br />
            Whatsapp - {siteConfig.phone1}
            <br />
            Email - {siteConfig.email}
          </p>
        </div>

        {/* Resources */}
        <div id="blogs">
          <h2 className="heading-font text-[23px] text-[#d20b4f] font-bold">
            Resources :
          </h2>

          <div className="mt-6 text-sm leading-[1.5] text-black">
            <Link href="/blog-preview" className="block text-black hover:text-[#d20b4f] no-underline">
              Blogs
            </Link>

            <Link href="/shop" className="block text-black hover:text-[#d20b4f] no-underline">
              Size Chart
            </Link>

            <Link href="/shop" className="block text-black hover:text-[#d20b4f] no-underline">
              Gallery
            </Link>
          </div>
        </div>

        {/* Location */}
        <div className="sm:col-span-2">
          <h2 className="heading-font text-[23px] text-[#d20b4f] font-bold">
            Location Details:
          </h2>

          <p className="mt-6 text-sm leading-[1.5] text-black">
            College More, Kanchrapara,
            <br />
            Kolkata, West Bengal
            <br />
            743145
          </p>
        </div>
      </div>
    </footer>
  );
}
