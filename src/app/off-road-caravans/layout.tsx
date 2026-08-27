import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Off-Road Camping Trailers For Sale – Australia’s Best Off-Road & 4WD Camping Trailers",
  description: "Browse off-road camping trailers for sale across Australia. Compare prices on rugged 4WD, hybrid and semi off-road models built for adventure and remote touring.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.caravansforsale.com.au/off-road-caravans/",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
