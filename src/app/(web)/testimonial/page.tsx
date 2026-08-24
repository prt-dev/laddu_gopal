import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import Testimonials from "../../components/web/Testimonials";

export const metadata: Metadata = {
  title: "Devotee Experiences & Reviews | Makhan Chor",
  description:
    "Read what devotees and Krishna bhakts worldwide share about their experience with Makhan Chor.",
};

export default function TestimonialPage() {
  return (
    <>
      <PageHeader
        title="Devotee Experiences"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Reviews", href: "#" },
          { label: "Devotee Voices" },
        ]}
      />
      <Testimonials />
    </>
  );
}
