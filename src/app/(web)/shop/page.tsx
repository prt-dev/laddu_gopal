import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import ShopSection from "../../components/web/ShopSection";

export const metadata: Metadata = {
  title: "Explore Articles & Publications | BlogVerse",
  description:
    "Browse our full collection of technology insights, design patterns, tutorials, and digital publications on BlogVerse.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        title="Articles & Publications"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Explore", href: "#" },
          { label: "Publications" },
        ]}
      />
      <ShopSection />
    </>
  );
}
