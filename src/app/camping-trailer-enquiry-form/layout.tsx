 import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "Camper Trailer Enquiry Form | Exclusive Camper Trailer Deals & Offers",
     template: "%s ",
   },
   description:
     "Fill out our camper trailer enquiry form to receive exclusive offers from select quality camper trailer manufacturers. Get the best camper trailer deals sent directly to you.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   verification: {
     google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: "https://www.campingtrailersforsale.com.au/camping-trailer-enquiry-form/",
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
