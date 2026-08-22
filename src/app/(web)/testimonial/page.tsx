import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import Testimonials from "../../components/web/Testimonials";

export const metadata: Metadata = {
  title: "Testimonials & Reviews | BlogVerse",
  description:
    "Read what readers, authors, and creators have to say about the BlogVerse reading and publishing experience.",
};

export default function TestimonialPage() {
  return (
    <>
      <PageHeader
        title="Testimonial"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Pages", href: "#" },
          { label: "Testimonial" },
        ]}
      />
      <Testimonials />
    </>
  );
}
