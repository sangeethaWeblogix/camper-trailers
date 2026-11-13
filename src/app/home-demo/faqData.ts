export type FaqItem = { q: string; a: string };
export type FaqTab = { label: string; items: FaqItem[] };

export const FAQ_TABS: FaqTab[] = [
  {
    label: "Camper Trailer Brands",
    items: [
      { q: "What are the most popular camper trailer brands in Australia?", a: "Well-known brands include Jayco, Cub, MDC, OPUS, Patriot Campers, Black Series, Track Trailer and Ezytrail. Compare different manufacturers based on price, construction, features and intended use." },
      { q: "Where can I find Jayco camper trailers for sale?", a: "Browse [Jayco camper trailers for sale](/listings/jayco/) on [CampingTrailersForSale.com.au](/). Compare models such as the Swan, Eagle, Penguin, Lark and J-Pod, subject to availability." },
      { q: "Where can I find Cub camper trailers for sale?", a: "Explore [Cub camper trailers for sale](/listings/cub/), including available hard-floor, forward-fold and off-road models. Compare prices, layouts and specifications." },
      { q: "Where can I find MDC camper trailers for sale?", a: "Browse [MDC camper trailers for sale](/listings/mdc/). Compare available folding and off-road models by condition, price, sleeping capacity and features." },
      { q: "Are OPUS camper trailers suitable for family camping?", a: "Many OPUS camper trailers offer expandable sleeping and living areas suited to family trips. Compare setup systems, sleeping capacity, weight and available accessories before buying." },
      { q: "Are Patriot camper trailers suitable for off-road travel?", a: "Patriot Campers manufactures off-road-focused trailers with compact designs and touring equipment. Compare individual models for ground clearance, suspension, payload and towing requirements." },
      { q: "Where can I find Black Series camper trailers for sale?", a: "Browse [Black Series camper trailers for sale](/listings/black-series/) and compare available hard-floor, folding and off-road models by price, age and features." },
    ],
  },
  {
    label: "Camper Trailer Types & Designs",
    items: [
      { q: "What is the difference between hard-floor and soft-floor camper trailers?", a: "Hard-floor campers use a rigid floor in their expanded living area, while soft-floor models generally use tent flooring. Each offers different setup times, space and storage requirements." },
      { q: "Where can I find forward-fold camper trailers for sale?", a: "Forward-fold camper trailers expand towards the drawbar, often creating an additional seating or living area. Browse [camper trailers for sale](/listings/) and compare available fold types and layouts." },
      { q: "What are the benefits of rear-fold camper trailers?", a: "Rear-fold camper trailers expand behind the trailer to create additional accommodation. Many offer practical sleeping arrangements and a relatively compact towing footprint." },
      { q: "Where can I find teardrop camper trailers for sale?", a: "Teardrop campers feature compact, rounded bodies with sleeping accommodation and often an external kitchen. Browse available camper trailer listings to compare teardrop designs and weights." },
      { q: "Are hybrid camper trailers suitable for off-road travel?", a: "Some hybrid campers are designed for off-road touring, with reinforced construction and suitable suspension. Browse [hybrid camper trailers for sale](/listings/hybrid-category/) and check each model's capabilities." },
      { q: "What are the benefits of pod-style camper trailers?", a: "Pod-style campers offer compact, often enclosed accommodation with relatively simple setup arrangements. They can suit couples and travellers wanting a smaller towing footprint." },
      { q: "Which camper trailers are easiest to set up at campsites?", a: "Some hard-floor, pop-up, teardrop and pod-style campers offer relatively quick setups. Compare the actual folding mechanism, awning requirements and number of setup steps before buying." },
      { q: "Where can I find toy hauler camper trailers for sale?", a: "Browse [toy hauler camper trailers for sale](/listings/toy-hauler-carrier-category/). These trailers can provide space for equipment such as motorcycles alongside camping facilities, depending on the design." },
    ],
  },
  {
    label: "Camper Trailer Prices & Budgets",
    items: [
      { q: "How much does a camper trailer cost in Australia?", a: "Camper trailers range from under $10,000 for some older used models to over $100,000 for premium off-road campers. Prices depend on brand, age, construction and features." },
      { q: "Where can I find camper trailers under $10,000?", a: "Browse [camper trailers under $10,000](/listings/under-10000/) to compare budget-friendly models. Check condition, canvas, suspension and repair requirements before purchasing." },
      { q: "Where can I find camper trailers under $20,000?", a: "Explore [camper trailers under $20,000](/listings/under-20000/), including available used folding campers, tent trailers and compact off-road models." },
      { q: "Where can I find camper trailers under $30,000?", a: "Browse [camper trailers under $30,000](/listings/under-30000/) and compare available new and used models by type, condition, sleeping capacity and location." },
      { q: "How much do premium camper trailers cost?", a: "Premium camper trailers can cost $60,000 to over $100,000, depending on construction, off-road capability and equipment. Advanced suspension, lithium batteries and larger living areas can increase prices." },
      { q: "What factors influence camper trailer prices?", a: "Prices depend on manufacturer, age, condition, construction, size and included equipment. Off-road suspension, solar systems, lithium batteries, kitchens, water storage and additional accommodation can affect value." },
    ],
  },
  {
    label: "Weight, Size & Towing",
    items: [
      { q: "What is the ideal weight for a lightweight camper trailer?", a: "Lightweight camper trailers are often around 750–1,500kg ATM, although suitability depends on your towing vehicle. Always check actual loaded weight, towball download and vehicle limits." },
      { q: "Where can I find camper trailers under 750kg?", a: "Some compact teardrop and basic camping trailers weigh under 750kg. Check individual specifications carefully, including whether the stated weight is tare, ATM or GTM." },
      { q: "Where can I find camper trailers under 1,500kg?", a: "Browse [camper trailers under 1,500kg ATM](/listings/under-1500-kg-atm/) to compare lightweight models with different sleeping arrangements, features and towing requirements." },
      { q: "What is the difference between ATM and tare weight?", a: "Tare weight is the trailer's mass in its specified unloaded condition. ATM (Aggregate Trailer Mass) is its maximum permitted loaded weight, including equipment, luggage and applicable towball load." },
      { q: "How do I calculate the towing capacity required for a camper trailer?", a: "Check your vehicle's braked or unbraked towing limit, towball download, GVM and GCM. Ensure the loaded camper trailer and complete towing combination remain within applicable limits." },
      { q: "What size camper trailer is suitable for a small SUV?", a: "A compact, lightweight camper trailer may suit a small SUV, depending on the vehicle's towing capacity and towball limits. Check the trailer's ATM and actual loaded weight." },
      { q: "What is the difference between braked and unbraked camper trailers?", a: "Braked trailers have their own braking system, while unbraked trailers rely on the towing vehicle. Australian rules generally require trailer brakes above 750kg GTM, with additional requirements for heavier trailers." },
    ],
  },
  {
    label: "Features, Maintenance & Ownership",
    items: [
      { q: "What kitchen facilities are available in camper trailers?", a: "Camper trailers may include slide-out kitchens, gas cooktops, sinks, refrigerators and food storage. Compare available layouts and equipment to find a practical setup for camping." },
      { q: "Which camper trailers have built-in water storage?", a: "Many touring and off-road camper trailers include onboard water tanks. Check tank capacity, plumbing, pumps and available external shower connections in individual listings." },
      { q: "What solar and battery systems are available in camper trailers?", a: "Camper trailers may include solar panels, portable solar blankets, AGM batteries or lithium battery systems. Choose a setup that supports your expected lighting, refrigeration and electrical needs." },
      { q: "What are the benefits of camper trailer awnings and annexes?", a: "Awnings and annexes provide additional shade, shelter and outdoor living space. Some offer enclosed areas suitable for dining, storage or extra accommodation." },
      { q: "Are independent suspension systems suitable for rough terrain?", a: "Independent suspension can help camper trailers handle uneven surfaces when properly designed. Ground clearance, tyres, chassis strength and suspension ratings also influence off-road suitability." },
      { q: "What should I inspect before buying a used camper trailer?", a: "Check the chassis, drawbar, suspension, brakes, bearings, tyres, canvas, seals and folding mechanisms. Inspect for corrosion, water damage and wear, and review maintenance records." },
      { q: "How often should camper trailer wheel bearings be serviced?", a: "Follow the manufacturer's maintenance schedule and inspect bearings before extended trips. Heavy use, water crossings and dusty conditions may require more frequent servicing." },
      { q: "What registration and insurance are required for camper trailers?", a: "Registration requirements vary by state, trailer weight and classification. Consider comprehensive trailer insurance for theft, damage and other insured risks, including camping accessories where covered." },
    ],
  },
  {
    label: "Camper Trailers for Sale by Location",
    items: [
      { q: "Where can I find camper trailers for sale in Sydney?", a: "Browse [camper trailers for sale in Sydney](/listings/new-south-wales-state/sydney-region/) on [CampingTrailersForSale.com.au](/). Compare new and used models from dealers and private sellers." },
      { q: "Where can I find camper trailers for sale in Melbourne?", a: "Explore [camper trailers for sale in Melbourne](/listings/victoria-state/melbourne-region/) and compare available models by price, type, make, condition and specifications." },
      { q: "Where can I find camper trailers for sale in Brisbane?", a: "Browse [camper trailers for sale in Brisbane](/listings/queensland-state/brisbane-region/) and compare available models from dealerships and private sellers across the region." },
      { q: "Where can I find camper trailers for sale in Perth?", a: "Find [camper trailers for sale in Perth](/listings/western-australia-state/perth-region/) and compare available folding, off-road, hybrid and touring models." },
      { q: "Where can I find camper trailers for sale in Adelaide?", a: "Browse [camper trailers for sale in Adelaide](/listings/south-australia-state/adelaide-region/) and compare prices, types, brands and available specifications." },
      { q: "How can I find camper trailers for sale near me?", a: "Use the location filters on [CampingTrailersForSale.com.au](/listings/) to search by state, city or region. Narrow results by price, condition, type and ATM." },
      { q: "Can I buy camper trailers from interstate dealers?", a: "Yes. You can contact interstate dealerships and arrange inspections or delivery. Check transport costs, registration requirements, warranty arrangements and payment conditions before purchasing." },
    ],
  },
  {
    label: "Selling a Camper Trailer",
    items: [
      { q: "How do I sell my camper trailer online in Australia?", a: "Create an advertisement on [CampingTrailersForSale.com.au](/sell-my-camper-trailer/), add your trailer's specifications, price and photos, and receive enquiries directly from interested buyers." },
      { q: "How much does it cost to advertise a camper trailer for sale?", a: "Private sellers pay $49 including GST for a listing on [CampingTrailersForSale.com.au](/). The one-time fee keeps your advertisement live until sold, with no sales commission." },
      { q: "Can private owners list camper trailers for sale?", a: "Yes. Private owners can [advertise camper trailers](/sell-my-camper-trailer/) directly for $49 including GST and communicate with interested buyers without a dealership." },
      { q: "Can dealerships advertise their camper trailer inventory?", a: "Yes. Australian dealerships can advertise eligible camper trailer stock through [CampingTrailersForSale.com.au](/), allowing buyers to compare available models and contact dealers directly." },
      { q: "What details should I include in a camper trailer advertisement?", a: "Include the make, model, year, condition, asking price, ATM, tare weight, sleeping capacity, folding design, suspension and accessories. Add clear photos of the trailer and its setup." },
      { q: "How can I attract more buyers to my camper trailer listing?", a: "Set a competitive price, upload clear photographs and provide accurate specifications. Highlight important features such as off-road capability, sleeping arrangements, kitchen facilities, solar systems and maintenance history." },
      { q: "How do I determine the resale value of my camper trailer?", a: "Compare similar camper trailers by brand, model, age, condition and features. Review current asking prices on [CampingTrailersForSale.com.au](/) and account for accessories and maintenance history." },
    ],
  },
  {
    label: "General & Buying",
    items: [
      { q: "Where can I find camper trailers for sale in Australia?", a: "Browse [new and used camper trailers for sale](/listings/) on [CampingTrailersForSale.com.au](/). Compare available models from dealerships and private sellers across Australia by price, type, make, location and specifications." },
      { q: "What is the difference between a camper trailer and a camping trailer?", a: "Camper trailer and camping trailer generally refer to the same type of towable recreational vehicle. In Australia, “camper trailer” is the more commonly used term." },
      { q: "What are the different types of camper trailers?", a: "Popular designs include hard-floor, soft-floor, forward-fold, rear-fold, teardrop, hybrid, off-road and tent trailers. Each offers different sleeping arrangements, setup requirements and towing characteristics." },
      { q: "Which camper trailers are suitable for Australian conditions?", a: "The best camper trailer depends on your destinations. Touring models suit sealed roads, while purpose-built off-road campers can handle selected rough tracks with suitable suspension, clearance and tyres." },
      { q: "What is the difference between a camper trailer and a caravan?", a: "Camper trailers are generally smaller and feature folding or expandable accommodation, while caravans usually offer more permanent indoor facilities. Compare camper trailers with [caravans for sale](https://www.caravansforsale.com.au/) to explore both options." },
      { q: "What should I consider when buying a camper trailer?", a: "Consider your budget, towing capacity, trailer weight, sleeping arrangements, setup time and intended destinations. Check storage, kitchen facilities, water capacity and overall condition before purchasing." },
      { q: "Where can I buy new camper trailers in Australia?", a: "Browse [new camper trailers for sale](/listings/new-condition/) from Australian dealerships. Compare models by brand, type, price, sleeping capacity and towing specifications." },
      { q: "Where can I find used camper trailers for sale?", a: "Explore [used camper trailers for sale](/listings/used-condition/) across Australia. Compare second-hand models from dealers and private sellers by age, price, condition and features." },
      { q: "Can I buy camper trailers directly from private sellers?", a: "Yes. [CampingTrailersForSale.com.au](/) includes private seller advertisements. Contact the owner directly, arrange an inspection and verify registration, ownership and trailer condition before purchasing." },
    ],
  },
];
