import { Metadata } from "next";
import Statement from "./statement";
import "./statement.css?=123";

export async function generateMetadata(): Promise<Metadata> {
  const metaTitle = "Buyer Safety Guide - CampingTrailersForSale";
  const metaDescription =
    "Learn how to buy a camper trailer safely — VIN checks, PPSR searches, secure payments, and scam prevention tips.";

  const robots = "index";

  return {
    title: metaTitle,
    description: metaDescription,
    robots: robots,

    alternates: {
      canonical: "https://www.campingtrailersforsale.com.au/buyer-safety-guide/",
    },

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: "https://www.campingtrailersforsale.com.au/buyer-safety-guide/",
      type: "article",
    },

    twitter: {
      title: metaTitle,
      description: metaDescription,
    },
  };
}

// Real step headings from statement.tsx's 10 numbered <h3> sections — Ahrefs
// classifies this page as "Article > How-to" based on that structure, but it
// had no matching schema at all.
const HOWTO_STEPS = [
  "Verify the Seller",
  "Inspect the Camper Trailer Before Payment",
  "Check the VIN or Chassis Number",
  "Check for Finance Owing",
  "Be Cautious of Prices That Are Too Good to Be True",
  "Avoid Sending Deposits Without Verification",
  "Meet the Seller in a Safe Location",
  "Confirm Ownership Documentation",
  "Use Secure Payment Methods",
  "Report Suspicious Listings",
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Buyer Safety Guide",
  description:
    "Safety guidelines for buying a camper trailer, covering seller verification, inspections, VIN checks, finance checks, and secure payment.",
  step: HOWTO_STEPS.map((name, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name,
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <Statement />
    </>
  );
}