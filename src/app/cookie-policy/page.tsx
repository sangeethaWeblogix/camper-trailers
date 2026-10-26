import { Metadata } from "next";
import Statement from "./statement";
import "./statement.css?=123";

export async function generateMetadata(): Promise<Metadata> {
  const metaTitle = "Cookie Policy - Marketplace Network";
  const metaDescription =
    "Read our Cookie Policy — how Marketplace Network websites use cookies to collect, use, and protect your personal information.";

  const robots = "index";

  return {
    title: metaTitle,
    description: metaDescription,
    robots: robots,

    alternates: {
      canonical: "https://www.campingtrailersforsale.com.au/cookie-policy/",
    },

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: "https://www.campingtrailersforsale.com.au/cookie-policy/",
      type: "article",
    },

    twitter: {
      title: metaTitle,
      description: metaDescription,
    },
  };
}

export default function Home() {
  return <Statement />;
}