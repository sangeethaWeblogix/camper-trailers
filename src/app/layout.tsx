
  // export const dynamic = "force-dynamic"

  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import "./globals.css?=42";
  import Navbar from "./navbar/Navbar";
  import NavbarSkeleton from "./navbar/NavbarSkeleton";
  import Footer from "./footer/Footer";
  import React, { Suspense } from "react";
  import Script from "next/script";
  import { Metadata } from "next";
  import { Montserrat } from "next/font/google";
  import ScrollToTop from "./navigation/ScrollToTopGlobal";
  import UTMTracker from "./UTMTracker";
  // import NextTopLoader from "nextjs-toploader";
import NavigationHistory from "@/components/NavigationHistory";
import { BannerProvider } from "@/components/BannerHandler";
import GlobalErrorTracker from "@/components/GlobalErrorTracker";
import { headers } from "next/headers";
import { metaFromSlug } from "@/utils/seo/meta";
import fetchListingsForHead, { buildListingsJsonLd, buildBreadcrumbs } from "@/utils/fetchListingsHead";
import GlobalImageFallback from "@/components/GlobalImageFallback";
import { fetchListingLinkCountsServer } from "./listings/fetchBrowseSectionData";
import { FOOTER_LISTING_HREFS } from "./footer/footerLinks";

  const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    variable: "--font-montserrat",
    preload: true,
  });

  
  export const metadata: Metadata = {
    icons: { icon: "/favicon.ico" },
    // robots: "index, follow",
    verification: {
      google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
    },

  };
  
  
  export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    // Per-slug metadata for /listings/* pages — injected directly into <head> JSX
    // (avoids async generateMetadata + streaming = metadata-in-body issue in Next.js 15)
    const h = await headers();
    const pathname = h.get("x-pathname") ?? "";
    const xRobots = h.get("x-robots") ?? "";
    // Footer hides /listings/ links whose page has no products — started now,
    // awaited just before render, so it runs alongside the head fetches below.
    const footerLinkCountsPromise = fetchListingLinkCountsServer(FOOTER_LISTING_HREFS);
    const isListingSlug =
      pathname.startsWith("/listings/") &&
      pathname !== "/listings/" &&
      pathname !== "/listings";

    let slugTitle = "";
    let slugDescription = "";
    let slugCanonical = "";
    let slugRobots = "";

    const isContactPage = pathname === "/contact/" || pathname === "/contact";
    const isMainListings = pathname === "/listings/" || pathname === "/listings";

    // Static pages whose metadata ends up after </head> due to streaming — inject directly
    const STATIC_META: Record<string, { title: string; description: string; canonical: string }> = {};
    const staticMeta = STATIC_META[pathname] ?? null;

    // Listings JSON-LD — fetched here so both schemas render inside <head>
    // Second call hits Next.js data cache (revalidate: 3600), no extra network round-trip.
    let listingsLd: object | null = null;
    if (isMainListings || isListingSlug) {
      const normalizedPath = pathname.endsWith("/") ? pathname : pathname + "/";
      const listingsData = await fetchListingsForHead(normalizedPath);
      if (listingsData) {
        const crumbs = buildBreadcrumbs(pathname);
        const pageUrl = `https://www.campingtrailersforsale.com.au${normalizedPath}`;
        ({ listingsLd } = buildListingsJsonLd(
          listingsData,
          pageUrl,
          crumbs,
          normalizedPath
        ));
      }
    }

    // Bare /listings/ went through the same async-generateMetadata + streaming
    // bug as slugged pages (title landed in <head>, description/canonical/robots/
    // og/twitter landed after </head>) because it was excluded from the fix below.
    const hasSlugMeta = isListingSlug || isMainListings;

    if (hasSlugMeta) {
      const slugString = pathname.replace(/^\/listings\//, "").replace(/\/$/, "");
      const slugParts = isMainListings ? [] : slugString.split("/").filter(Boolean);

      // Middleware already computed the live, inventory-aware robots decision
      // (same value it sent as the X-Robots-Tag response header) — use it
      // directly so the <meta name="robots"> tag can never disagree with the
      // HTTP header, instead of re-deriving a URL-shape-only guess below that
      // has no idea whether this specific filter combo currently has 0 results.
      if (isListingSlug && xRobots) {
        slugRobots = xRobots;
        slugCanonical = `https://www.campingtrailersforsale.com.au/listings/${slugParts.join("/")}/`;
        slugDescription = "Browse camper trailers for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity.";
      } else {
        // try {
          // All SEO from metaFromSlug — pure computation, no API call
          const meta = await metaFromSlug(slugParts, {});
          slugCanonical = (meta.alternates?.canonical as string) ?? "";
          if (meta.robots && typeof meta.robots === "object" && "index" in meta.robots) {
            slugRobots = (meta.robots as { index: boolean }).index ? "index, follow" : "noindex";
          } else {
            slugRobots = "index, follow";
          }
          if (meta.title && typeof meta.title === "object" && "absolute" in meta.title) {
            slugTitle = (meta.title as { absolute: string }).absolute;
          }
          slugDescription = "Browse camper trailers for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity.";
        // } catch {
        //   const parts = slugParts
        //     .map((p: string) =>
        //       p.replace(/-(category|state|region|condition|search|suburb)$/, "")
        //        .replace(/-/g, " ")
        //        .replace(/\b\w/g, (c: string) => c.toUpperCase())
        //     )
        //     .filter(Boolean);
        //   slugTitle = parts.length
        //     ? `${parts.join(" ")} Caravans for Sale in Australia`
        //     : "Caravans for Sale in Australia";
        //   slugCanonical = `https://www.campingtrailersforsale.com.au/listings/${slugParts.join("/")}/`;
        //   slugDescription = "Browse caravans for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity.";
        //   slugRobots = "index, follow";
        // }
      }
    }

    const footerLinkCounts = await footerLinkCountsPromise;
    return (
      <html lang="en">
        <head>
          {/* Static pages SEO — injected here to avoid metadata-in-body streaming issue */}
          {staticMeta && <title>{staticMeta.title}</title>}
          {staticMeta && <meta name="description" content={staticMeta.description} />}
          {staticMeta && <link rel="canonical" href={staticMeta.canonical} />}
          {staticMeta && <meta name="robots" content="index, follow" />}
          {staticMeta && <meta property="og:title" content={staticMeta.title} />}
          {staticMeta && <meta property="og:description" content={staticMeta.description} />}
          {staticMeta && <meta property="og:url" content={staticMeta.canonical} />}
          {staticMeta && <meta name="twitter:title" content={staticMeta.title} />}
          {staticMeta && <meta name="twitter:description" content={staticMeta.description} />}
          {/* Product page SEO (title/description/canonical/robots/og/twitter) comes
              entirely from generateMetadata in product/[slug]/page.tsx — it already
              covers everything this block used to duplicate (via its own separate
              fetchProductMeta call), which was producing two <title> and two
              <meta name="description"> tags on every product page. */}
          {/* Per-slug SEO tags for /listings/* (incl. bare /listings/) — rendered before streaming starts */}
          {/* <title> is set by generateMetadata in [...slug]/page.tsx via fast metaFromSlug (no API call) */}
          {hasSlugMeta && slugDescription && <meta name="description" content={slugDescription} />}
          {hasSlugMeta && slugCanonical && <link rel="canonical" href={slugCanonical} />}
          {hasSlugMeta && <meta name="robots" content={slugRobots} />}
          {hasSlugMeta && slugTitle && <meta property="og:title" content={slugTitle} />}
          {hasSlugMeta && slugDescription && <meta property="og:description" content={slugDescription} />}
          {hasSlugMeta && slugCanonical && <meta property="og:url" content={slugCanonical} />}
          {hasSlugMeta && slugTitle && <meta name="twitter:title" content={slugTitle} />}
          {hasSlugMeta && slugDescription && <meta name="twitter:description" content={slugDescription} />}
          {/* Contact page JSON-LD */}
          {isContactPage && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "WebSite",
                      "@id": "https://www.campingtrailersforsale.com.au/#website",
                      "url": "https://www.campingtrailersforsale.com.au/",
                      "name": "Camper Trailers For Sale",
                      "alternateName": "Camper Trailers For Sale by Marketplace Network",
                    },
                    {
                      "@type": "Organization",
                      "@id": "https://www.campingtrailersforsale.com.au/#organization",
                      "name": "Marketplace Network Pty Ltd",
                      "legalName": "Marketplace Network Pty Ltd",
                      "taxID": "ABN 70 694 987 052",
                      "url": "https://www.campingtrailersforsale.com.au/",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.campingtrailersforsale.com.au/images/our_sites/cts-logo.png",
                        "caption": "Camper Trailers For Sale by Marketplace Network",
                      },
                      "contactPoint": {
                        "@type": "ContactPoint",
                        "contactType": "customer service",
                        "url": "https://www.campingtrailersforsale.com.au/contact/",
                        "availableLanguage": "en",
                        "areaServed": "AU",
                      },
                    },
                    {
                      "@type": "ContactPage",
                      "@id": "https://www.campingtrailersforsale.com.au/contact/#webpage",
                      "url": "https://www.campingtrailersforsale.com.au/contact/",
                      "name": "Contact Us | Get in Touch with Camper Trailers For Sale",
                      "isPartOf": { "@id": "https://www.campingtrailersforsale.com.au/#website" },
                      "about": { "@id": "https://www.campingtrailersforsale.com.au/#organization" },
                      "description": "Have a question about buying, selling, or dealer advertising solutions? Fill out our online contact form to get in touch with the Camper Trailers For Sale customer support team.",
                      "breadcrumb": { "@id": "https://www.campingtrailersforsale.com.au/contact/#breadcrumb" },
                    },
                    {
                      "@type": "BreadcrumbList",
                      "@id": "https://www.campingtrailersforsale.com.au/contact/#breadcrumb",
                      "itemListElement": [
                        {
                          "@type": "ListItem",
                          "position": 1,
                          "name": "Home",
                          "item": "https://www.campingtrailersforsale.com.au/",
                        },
                        {
                          "@type": "ListItem",
                          "position": 2,
                          "name": "Contact Us",
                          "item": "https://www.campingtrailersforsale.com.au/contact/",
                        },
                      ],
                    },
                  ],
                }),
              }}
            />
          )}
          {/* Listings page JSON-LD — WebSite + CollectionPage + BreadcrumbList + ItemList (+ FAQPage) */}
          {listingsLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(listingsLd) }}
            />
          )}
          {/* ✅ Google Tag Manager (Head) */}
          <Script
            id="gtm-head"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){
                  w[l]=w[l]||[];
                  w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                  var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true;
                  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                  f?f.parentNode.insertBefore(j,f):d.head.appendChild(j);
                })(window,document,'script','dataLayer','GTM-N3362FGQ');
              `,
            }}
          />



        </head>
        <body
          className={`flex flex-col min-h-screen new_font ${montserrat.className}`}
        >
          {/* ✅ Google Tag Manager (noscript) - right after body */}
         <noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-N3362FGQ"
    height="0"
    width="0"
    style={{ display: "none", visibility: "hidden" }}
  />
</noscript>

  
         <Suspense fallback={null}>
  <UTMTracker />
</Suspense>
<Suspense fallback={null}>
  <NavigationHistory />
</Suspense>
<Suspense fallback={<NavbarSkeleton />}>
  <Navbar />
</Suspense>
                  <Suspense fallback={null}>

          <ScrollToTop />
          </Suspense>
          <main className="product-page style-5 flex-1">
            {/* <NextTopLoader
          color="#0066cc"
          height={3}
          showSpinner={false}
        /> */}
          <GlobalErrorTracker />
                    <GlobalImageFallback />

          <BannerProvider>
          {children}
          </BannerProvider>
                    </main>
          <Footer linkCounts={footerLinkCounts} />
        </body>
      </html>
      
    );
  }
  