import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sell My Camper Trailer Online Australia | List Until Sold for $49",
  description:
    "Sell your camper trailer online for just $49. List until sold, edit anytime, no commission — connect directly with genuine buyers.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.campingtrailersforsale.com.au/sell-my-camper-trailer/",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
