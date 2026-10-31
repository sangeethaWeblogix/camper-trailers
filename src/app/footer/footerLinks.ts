// Plain (non-client) module for the footer's link data, so the server root
// layout can read it too (Footer.tsx and FooterNav.tsx are client components).

export const SELL_DATA = [
  {
    state: "Victoria",
    stateSlug: "victoria",
    regions: [
      { label: "Melbourne", pageSlug: "melbourne" },
      { label: "Geelong", pageSlug: "geelong" },
      { label: "Ballarat", pageSlug: "ballarat" },
      { label: "Latrobe Gippsland", pageSlug: "latrobe-gippsland" },
      { label: "Mornington Peninsula", pageSlug: "mornington-peninsula" },
      { label: "Shepparton", pageSlug: "shepparton" },
      { label: "Hume", pageSlug: "hume" },
      { label: "Bendigo", pageSlug: "bendigo" },
      { label: "North West", pageSlug: "north-west" },
      { label: "Warrnambool And South West", pageSlug: "warrnambool-and-south-west" },
    ],
  },
  {
    state: "New South Wales",
    stateSlug: "new-south-wales",
    regions: [
      { label: "Sydney", pageSlug: "sydney" },
      { label: "Hunter", pageSlug: "hunter" },
      { label: "Newcastle", pageSlug: "newcastle" },
      { label: "Central Coast", pageSlug: "central-coast" },
      { label: "Coffs Harbour", pageSlug: "coffs-harbour" },
      { label: "Southern Highlands", pageSlug: "southern-highlands" },
      { label: "Richmond Tweed", pageSlug: "richmond-tweed" },
      { label: "Central West", pageSlug: "central-west" },
      { label: "Mid North Coast", pageSlug: "mid-north-coast" },
      { label: "Murray", pageSlug: "murray" },
      { label: "New England", pageSlug: "new-england" },
      { label: "Riverina", pageSlug: "riverina" },
      { label: "Capital", pageSlug: "capital" },
      { label: "Orana", pageSlug: "orana" },
      { label: "Illawarra", pageSlug: "illawarra" },
      { label: "Canberra", pageSlug: "canberra" },
    ],
  },
  {
    state: "Queensland",
    stateSlug: "queensland",
    regions: [
      { label: "Brisbane", pageSlug: "brisbane" },
      { label: "Gold Coast", pageSlug: "gold-coast" },
      { label: "Sunshine Coast", pageSlug: "sunshine-coast" },
      { label: "Moreton Bay North", pageSlug: "moreton-bay-north" },
      { label: "Moreton Bay South", pageSlug: "moreton-bay-south" },
      { label: "Logan Beaudesert", pageSlug: "logan-beaudesert" },
      { label: "Ipswich", pageSlug: "ipswich" },
      { label: "Toowoomba", pageSlug: "toowoomba" },
      { label: "Townsville", pageSlug: "townsville" },
      { label: "Cairns", pageSlug: "cairns" },
      { label: "Wide Bay", pageSlug: "wide-bay" },
      { label: "Mackay Isaac Whitsunday", pageSlug: "mackay-isaac-whitsunday" },
    ],
  },
  {
    state: "South Australia",
    stateSlug: "south-australia",
    regions: [
      { label: "Adelaide", pageSlug: "adelaide" },
      { label: "South East", pageSlug: "south-east" },
    ],
  },
  {
    state: "Western Australia",
    stateSlug: "western-australia",
    regions: [
      { label: "Perth", pageSlug: "perth" },
      { label: "Mandurah", pageSlug: "mandurah" },
      { label: "Bunbury", pageSlug: "bunbury" },
      { label: "Outback South", pageSlug: "outback-south" },
    ],
  },
  {
    state: "Tasmania",
    stateSlug: "tasmania",
    regions: [
      { label: "Hobart", pageSlug: "hobart" },
      { label: "Launceston", pageSlug: "launceston" },
      { label: "North West", pageSlug: "north-west" },
    ],
  },
];

export const BROWSE_LINKS = [
  { label: "All Camper Trailers for Sale", href: "/listings/" },
  { label: "New Camper Trailers", href: "/listings/new-condition/" },
  { label: "Used Camper Trailers", href: "/listings/used-condition/" },
  { label: "Hybrid Camper Trailers", href: "/listings/hybrid-category/" },
  { label: "Camper Trailers", href: "/listings/camper-trailer-category/" },
  { label: "Off Road Camper Trailers", href: "/listings/off-road-camper-category/" },
  { label: "Tent Trailers", href: "/listings/tent-trailer-category/" },
  { label: "Toy Hauler Carriers", href: "/listings/toy-hauler-carrier-category/" },
];

export const POPULAR_LOCATIONS = [
  { label: "Adelaide", stateSlug: "south-australia", regionSlug: "adelaide" },
  { label: "Brisbane", stateSlug: "queensland", regionSlug: "brisbane" },
  { label: "Gold Coast", stateSlug: "queensland", regionSlug: "gold-coast" },
  { label: "Melbourne", stateSlug: "victoria", regionSlug: "melbourne" },
  { label: "Perth", stateSlug: "western-australia", regionSlug: "perth" },
  { label: "Sydney", stateSlug: "new-south-wales", regionSlug: "sydney" },
  { label: "Cairns", stateSlug: "queensland", regionSlug: "cairns" },
];

/** Shown only after "View All Locations" is clicked — appended below the
 * 7 above so that list doesn't reorder, just grows in place. */
export const MORE_LOCATIONS = [
  { label: "Ballarat", stateSlug: "victoria", regionSlug: "ballarat" },
  { label: "Bendigo", stateSlug: "victoria", regionSlug: "bendigo" },
  { label: "Bunbury", stateSlug: "western-australia", regionSlug: "bunbury" },
  { label: "Geelong", stateSlug: "victoria", regionSlug: "geelong" },
  { label: "Hobart", stateSlug: "tasmania", regionSlug: "hobart" },
  { label: "Newcastle", stateSlug: "new-south-wales", regionSlug: "newcastle" },
  { label: "Sunshine Coast", stateSlug: "queensland", regionSlug: "sunshine-coast" },
  { label: "Toowoomba", stateSlug: "queensland", regionSlug: "toowoomba" },
  { label: "Townsville", stateSlug: "queensland", regionSlug: "townsville" },
];

// Every /listings/ href the footer can render — layout.tsx fetches each one's
// live count so the footer can hide links to empty pages.
export const FOOTER_LISTING_HREFS = [
  ...BROWSE_LINKS.map((l) => l.href),
  ...SELL_DATA.map((s) => `/listings/${s.stateSlug}-state/`),
  ...[...POPULAR_LOCATIONS, ...MORE_LOCATIONS].map((l) => `/listings/${l.stateSlug}-state/${l.regionSlug}-region/`),
];
