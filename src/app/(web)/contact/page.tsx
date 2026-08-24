import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import ContactSection from "../../components/web/ContactSection";

export const metadata: Metadata = {
  title: "Contact Us | Makhan Chor - Laddu Gopal",
  description:
    "Get in touch with Makhan Chor for handcrafted Laddu Gopal poshak, pagdi, and devotional accessories orders.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Makhan Chor"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />
      <ContactSection />
    </>
  );
}
