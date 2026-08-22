import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import ContactSection from "../../components/web/ContactSection";

export const metadata: Metadata = {
  title: "Contact Editorial & Support | BlogVerse",
  description:
    "Get in touch with the BlogVerse editorial team for article submissions, writer partnerships, or general inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Pages", href: "#" },
          { label: "Contact" },
        ]}
      />
      <ContactSection />
    </>
  );
}
