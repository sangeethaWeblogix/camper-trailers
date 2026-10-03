 import "./contact.css";
import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "Contact Camper Trailers For Sale | Australia’s Camper Trailer Marketplace",
     template: "%s ",
   },
   description:
     "Have a question about camper trailers in Australia? Contact Camper Trailers For Sale for support, inquiries, or help finding your next camper trailer today.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   verification: {
     google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: "https://www.campingtrailersforsale.com.au/contact/",
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
