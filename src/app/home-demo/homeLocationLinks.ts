// Plain (non-client) module so the server home page can fetch each link's
// live count (see page.tsx) and HomeLocationSection can hide empty ones.

export const MAJOR_CITIES = [
  { name: "Adelaide",   href: "/listings/south-australia-state/adelaide-region/",    imgSrc: "/images/Adelaide.png"   },
  { name: "Brisbane",   href: "/listings/queensland-state/brisbane-region/",         imgSrc: "/images/Brisbane.png"   },
  { name: "Gold Coast", href: "/listings/queensland-state/gold-coast-region/",       imgSrc: "/images/Gold-Coast.png" },
  { name: "Melbourne",  href: "/listings/victoria-state/melbourne-region/",          imgSrc: "/images/Melbourne.png"  },
  { name: "Perth",      href: "/listings/western-australia-state/perth-region/",     imgSrc: "/images/Perth.png"      },
  { name: "Sydney",     href: "/listings/new-south-wales-state/sydney-region/",      imgSrc: "/images/Sydney.png"     },
];

export const MINOR_CITIES = [
  { name: "Cairns",         href: "/listings/queensland-state/cairns-region/" },
  { name: "Canberra",       href: "/listings/australian-capital-territory-state/australian-capital-territory-region/" },
  { name: "Darwin",         href: "/listings/northern-territory-state/darwin-region/" },
  { name: "Geelong",        href: "/listings/victoria-state/geelong-region/" },
  { name: "Hobart",         href: "/listings/tasmania-state/hobart-region/" },
  { name: "Newcastle",      href: "/listings/new-south-wales-state/newcastle-region/" },
  { name: "Sunshine Coast", href: "/listings/queensland-state/sunshine-coast-region/" },
  { name: "Townsville",     href: "/listings/queensland-state/townsville-region/" },
  { name: "Wollongong",     href: "/listings/new-south-wales-state/illawarra-region/" },
  { name: "Ballarat",       href: "/listings/victoria-state/ballarat-region/" },
];

export const FILTERS = [
  {
    icon: "/images/Budget.png", iconAlt: "Budget",
    label: "By Price",
    items: [
      { text: "Under $30,000",       href: "/listings/under-30000/" },
      { text: "$30,000 – $40,000",   href: "/listings/between-30000-40000/" },
      { text: "$40,000 – $50,000",   href: "/listings/between-40000-50000/" },
      { text: "$50,000 – $70,000",   href: "/listings/between-50000-70000/" },
      { text: "$70,000 – $80,000",   href: "/listings/between-70000-80000/" },
      { text: "$80,000 – $100,000",  href: "/listings/between-80000-100000/" },
      { text: "Over $100,000",       href: "/listings/over-100000/" }, 
    ],
  },
  {
    icon: "/images/ATM.png", iconAlt: "Weight ATM",
    label: "By Weight (ATM)",
    items: [
      { text: "Under 1500kg", href: "/listings/under-1500-kg-atm/" },
      { text: "Under 2000kg", href: "/listings/under-2000-kg-atm/" },
      { text: "Under 2500kg", href: "/listings/under-2500-kg-atm/" },
      { text: "Under 3000kg", href: "/listings/under-3000-kg-atm/" },
       
      { text: "Over 3000kg",  href: "/listings/over-3000-kg-atm/" },
       
    ],
  },
  {
    icon: "/images/Length.png", iconAlt: "Length",
    label: "By Size (Length)",
    items: [
      
      { text: "Under 16ft",     href: "/listings/under-16-length-in-feet/" },
      { text: "16ft – 18ft",    href: "/listings/between-16-18-length-in-feet/" },
      { text: "18ft – 20ft",    href: "/listings/between-18-20-length-in-feet/" },
      { text: "20ft – 22ft",    href: "/listings/between-20-22-length-in-feet/" },
      { text: "Over 22ft",      href: "/listings/over-22-length-in-feet/" },
    ],
  },
  {
    icon: "/images/Sleeping.png", iconAlt: "Sleeping",
    label: "By Sleeping Capacity",
    items: [
      { text: "2 Berth",     href: "/listings/2-people-sleeping-capacity/" },
      { text: "3 Berth",     href: "/listings/3-people-sleeping-capacity/" },
      { text: "4 Berth",     href: "/listings/4-people-sleeping-capacity/" },
      { text: "4+ Berth",    href: "/listings/over-3-people-sleeping-capacity/" },
      
      
    ],
  },
];

export const HOME_LOCATION_HREFS = [
  ...MAJOR_CITIES.map((c) => c.href),
  ...MINOR_CITIES.map((c) => c.href),
  ...FILTERS.flatMap((f) => f.items.map((i) => i.href)),
];
