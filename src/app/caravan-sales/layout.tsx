import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Camping Trailer Sales Australia | New & Used Camping Trailers for Sale",
  description: "Find the best camping trailer sales across Australia. Browse thousands of new and used camping trailers from trusted dealers and private sellers. Compare prices, types, and locations to find your perfect camping trailer.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.caravansforsale.com.au/caravan-sales/",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
