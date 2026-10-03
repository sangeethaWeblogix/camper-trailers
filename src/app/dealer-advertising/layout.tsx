 import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "Camper Trailer Dealer Advertising | Unlimited Listings $99/Month | CampingTrailersForSale",
     template: "%s ",
   },
   description:
     "Advertise your camper trailer dealership on CampingTrailersForSale.com.au. Unlimited listings, zero lead fees, and reach high-intent camper trailer buyers across Australia.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   verification: {
     google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: "https://www.campingtrailersforsale.com.au/dealer-advertising/",
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
