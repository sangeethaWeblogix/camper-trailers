import SellerDemo from "./seller-demo";
import "./seller-demo.css";

const BASE_URL = "https://www.caravansforsale.com.au";

const sellPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE_URL}/sell-my-camper-trailer/#webpage`,
      "url": `${BASE_URL}/sell-my-camper-trailer/`,
      "name": "Sell My Camping Trailer Online Australia | List Until Sold for $49",
      "description":
        "Sell your camping trailer online across Australia for just $49. List until sold, edit anytime, pay no commission and connect directly with genuine camping trailer buyers.",
      "inLanguage": "en-AU",
      "isPartOf": { "@id": `${BASE_URL}/#website` },
    },
    {
      "@type": "Service",
      "@id": `${BASE_URL}/sell-my-camper-trailer/#service`,
      "name": "Private Camping Trailer Listing Service",
      "url": `${BASE_URL}/sell-my-camper-trailer/`,
      "description":
        "List your camping trailer for sale on CaravansForSale.com.au for a one-time $49 fee. No commissions, no subscriptions, live until sold.",
      "provider": {
        "@type": "Organization",
        "name": "Camping Trailers For Sale",
        "url": BASE_URL,
      },
      "areaServed": {
        "@type": "Country",
        "name": "Australia",
      },
      "offers": {
        "@type": "Offer",
        "price": "49",
        "priceCurrency": "AUD",
        "description": "One-time listing fee, live until sold, no commissions",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE_URL}/sell-my-camper-trailer/#faqpage`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I sell my camping trailer online in Australia?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can sell your camping trailer online by creating a private seller listing on CaravansForSale.com.au. Add your camping trailer details, upload clear photos, set your asking price and publish your ad so buyers across Australia can contact you directly.",
          },
        },
        {
          "@type": "Question",
          "name": "How much does it cost to list my camping trailer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It costs $49 inc. GST to list your camping trailer on CaravansForSale.com.au. This is a one-time listing fee with no monthly subscription, no hidden charges and no commission when your camping trailer sells.",
          },
        },
        {
          "@type": "Question",
          "name": "How long does my camping trailer listing stay live?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Your camping trailer listing stays live until sold. You do not need to keep paying monthly fees to keep your ad active. Once your camping trailer is sold, you can remove the listing from the website.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I edit my camping trailer listing after publishing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. After your listing is published, you can update your camping trailer details, change the asking price, add or replace photos and improve your description if needed.",
          },
        },
        {
          "@type": "Question",
          "name": "How do buyers contact me?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Interested buyers can contact you directly through your camping trailer listing. This allows you to answer questions, arrange inspections, negotiate the price and manage the sale privately.",
          },
        },
        {
          "@type": "Question",
          "name": "Do I pay commission when my camping trailer sells?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. CaravansForSale.com.au does not charge commission when your camping trailer sells. You pay the one-time listing fee and keep 100% of the agreed sale price.",
          },
        },
        {
          "@type": "Question",
          "name": "How should I price my camping trailer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Check similar camping trailers for sale before setting your price. Compare by make, model, year, condition, length, ATM, tare weight, sleeping capacity, features and location. A realistic asking price can help attract more genuine buyers.",
          },
        },
        {
          "@type": "Question",
          "name": "Is it safe to sell my camping trailer privately online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, but you should take normal precautions. Speak with buyers directly, meet in a safe location, confirm payment has cleared before handover and complete any required transfer paperwork for your state or territory.",
          },
        },
      ],
    },
  ],
};

export default function SellMyCaravan() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sellPageJsonLd) }}
      />
      <SellerDemo />
    </>
  );
}
