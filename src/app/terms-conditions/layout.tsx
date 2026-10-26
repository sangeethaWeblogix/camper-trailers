 import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "Terms of Use – CampingTrailersForSale.com.au | Marketplace Network",
     template: "%s ",
   },
   description:
     "Read the Terms of Use for CampingTrailersForSale.com.au — our marketplace platform's listings policy, user responsibilities, and terms.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   verification: {
     google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: "https://www.campingtrailersforsale.com.au/terms-conditions/",

   },
   
   openGraph: {
      url: "https://www.campingtrailersforsale.com.au/terms-conditions/",
     title: "Terms of Use – CampingTrailersForSale.com.au | Marketplace Network",
       description:
     "Read the Terms of Use for CampingTrailersForSale.com.au — our marketplace platform's listings policy, user responsibilities, and terms.",
     
   },
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
