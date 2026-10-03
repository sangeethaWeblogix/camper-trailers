 import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "About Camper Trailer Marketplace - Your Trusted Camper Trailer Resource",
     template: "%s ",
   },
   description:
     "Camper Trailer Marketplace is your go-to platform for finding the perfect camper trailer from the right manufacturer or dealer @ the right price.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   verification: {
     google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: "https://www.campingtrailersforsale.com.au/about-us/",
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
