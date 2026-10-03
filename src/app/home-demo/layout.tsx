import { Metadata } from "next";
import { ReactNode } from "react";
 
export const metadata: Metadata = {
  title: "Camper Trailers For Sale – Australia’s Marketplace for New & Used Camper Trailers",
  description:"Browse camper trailers for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity",
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://www.campingtrailersforsale.com.au/home-demo/",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
