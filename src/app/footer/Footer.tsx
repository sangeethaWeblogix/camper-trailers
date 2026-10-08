"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import "./footer.css?=31";
import BackToTopButton from "./BackToTopButton";
import { SELL_DATA } from "./FooterNav";

const POPULAR_LOCATIONS = [
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
const MORE_LOCATIONS = [
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

const OUR_SITES = [
  { name: "Caravans For Sale", href: "https://www.caravansforsale.com.au/", logo: "/images/our_sites/cfs-logo-black.svg" },
  { name: "Motorhomes For Sale", href: "https://www.motorhomesforsale.com.au/", logo: "/images/our_sites/mfs-logo.svg" },
  { name: "Campervans For Sale", href: "https://www.campervansforsale.au/", logo: "/images/our_sites/camper_logo.svg" },
  { name: "Camping Trailers For Sale", href: "/", logo: "/images/our_sites/cts-logo.svg", current: true },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [sellOpen, setSellOpen] = useState(false);
  const [locationsExpanded, setLocationsExpanded] = useState(false);
  const sellCardRef = useRef<HTMLDivElement>(null);

  const openSellCard = () => {
    setSellOpen(true);
    sellCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <footer className="style-8 ft-v2">
        <div className="container">
          <div className="ft-grid">

            {/* Browse Camper Trailers */}
            <div className="ft-col">
              <h4 className="ft-col__title">Browse Camper Trailers</h4>
              <ul className="ft-col__list">
                <li><a href="/listings/">All Camper Trailers for Sale</a></li>
                <li><a href="/listings/new-condition/">New Camper Trailers</a></li>
                <li><a href="/listings/used-condition/">Used Camper Trailers</a></li>
                <li><a href="/listings/hybrid-category/">Hybrid Camper Trailers</a></li>
                <li><a href="/listings/camper-trailer-category/">Camper Trailers</a></li>
                <li><a href="/listings/off-road-camper-category/">Off Road Camper Trailers</a></li>
                <li><a href="/listings/tent-trailer-category/">Tent Trailers</a></li>
              </ul>
            </div>

            {/* Browse by State */}
            <div className="ft-col">
              <h4 className="ft-col__title">Browse by State</h4>
              <ul className="ft-col__list">
                {SELL_DATA.map((s) => (
                  <li key={s.stateSlug}>
                    <a href={`/listings/${s.stateSlug}-state/`}>{s.state}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Locations */}
            <div className="ft-col">
              <h4 className="ft-col__title">Popular Locations</h4>
              <ul className="ft-col__list">
                {POPULAR_LOCATIONS.map((l) => (
                  <li key={l.regionSlug}>
                    <a href={`/listings/${l.stateSlug}-state/${l.regionSlug}-region/`}>{l.label}</a>
                  </li>
                ))}
                {locationsExpanded && MORE_LOCATIONS.map((l) => (
                  <li key={l.regionSlug}>
                    <a href={`/listings/${l.stateSlug}-state/${l.regionSlug}-region/`}>{l.label}</a>
                  </li>
                ))}
                {!locationsExpanded && (
                  <li>
                    <button
                      className="ft-col__view-all ft-sell-trigger"
                      onClick={() => setLocationsExpanded(true)}
                    >
                      View All Locations
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Private Sellers + For Dealers — stacked in one column */}
            <div className="ft-col">
              <h4 className="ft-col__title">Private Sellers</h4>
              <ul className="ft-col__list">
                <li><a href="/sell-my-camper-trailer/">Sell My Camper Trailer</a></li>
                <li>
                  <button
                    className="ft-sell-trigger"
                    onClick={openSellCard}
                    aria-expanded={sellOpen}
                    aria-controls="ft-sell-panel"
                  >
                    Sell by Location
                  </button>
                </li>
                <li><a href="https://seller.marketplacenetwork.com.au/seller-login/">Seller Login</a></li>
              </ul>

              <h4 className="ft-col__title ft-col__title--stacked">For Dealers</h4>
              <ul className="ft-col__list">
                <li><a href="https://seller.marketplacenetwork.com.au/subscriber-login/">Dealer Login</a></li>
                <li><a href="/dealer-advertising/">Dealer Advertising</a></li>
                <li><a href="https://seller.marketplacenetwork.com.au/camper-trailer-dealer-subscription/">Dealer Sign Up</a></li>
              </ul>
            </div>

            {/* Guides & Support */}
            <div className="ft-col">
              <h4 className="ft-col__title">Guides &amp; Support</h4>
              <ul className="ft-col__list">
                <li><a href="/blog/">Blog</a></li>
                <li><a href="/buyer-safety-guide/" rel="nofollow">Buyer Safety Guide</a></li>
                <li><a href="/about-us/">About Us</a></li>
                <li><a href="/contact/">Contact Us</a></li>
              </ul>
            </div>

          </div>

          {/* Our Marketplace Network — sibling marketplace sites */}
          <div className="ft-sites">
            <h4 className="ft-sites__label">Our Marketplace Network</h4>
            <div className="ft-sites__row">
              {OUR_SITES.map((site) => (
                <a
                  key={site.href}
                  href={site.href}
                  className={`ft-sites__logo${site.current ? " ft-sites__logo--current" : ""}`}
                  {...(site.current ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <Image src={site.logo} alt={site.name} width={140} height={32} unoptimized />
                </a>
              ))}
            </div>
          </div>

          {/* Sell by Location — expandable state/region grid */}
          <div className="ft-sell-card" ref={sellCardRef}>
            <button
              className="ft-sell-card__trigger"
              onClick={() => setSellOpen((v) => !v)}
              aria-expanded={sellOpen}
              aria-controls="ft-sell-panel"
            >
              <span className="ft-sell-card__text">
                <span className="ft-sell-card__title">Sell My Camper Trailer by Location</span>
                <span className="ft-sell-card__sub">Browse selling pages by state, city and region</span>
              </span>
              <span className={`ft-sell-card__icon${sellOpen ? " ft-sell-card__icon--open" : ""}`}>+</span>
            </button>
            {sellOpen && (
              <div className="ft-sell-panel" id="ft-sell-panel">
                <div className="ft-sell-panel__grid">
                  {SELL_DATA.map((s) => (
                    <div key={s.stateSlug} className="ft-sell-panel__col">
                      <a href={`/sell-my-camper-trailer/${s.stateSlug}/`} className="ft-sell-panel__state-title">
                        Sell My Camper Trailer in {s.state}
                      </a>
                      <ul className="ft-sell-panel__region-list">
                        {s.regions.map((r) => (
                          <li key={r.pageSlug}>
                            <a href={`/sell-my-camper-trailer/${s.stateSlug}/${r.pageSlug}/`}>
                              Sell My Camper Trailer in {r.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Legal + Copyright */}
          <div className="ft-bottom">
            <ul className="ft-legal">
              <li><a href="/terms-conditions/" rel="nofollow">Terms &amp; Conditions</a></li>
              <li><a href="/privacy-policy/" rel="nofollow">Privacy Policy</a></li>
              <li><a href="/privacy-collection-statement/" rel="nofollow">Privacy Collection Statement</a></li>
              <li><a href="/cookie-policy/" rel="nofollow">Cookie Policy</a></li>
            </ul>
            <p className="ft-copyright">
              © {currentYear ?? "----"} Marketplace Network Pty Ltd &middot; ABN 70 694 987 052
            </p>
          </div>

        </div>
      </footer>

      {/* To Top Button */}
      <BackToTopButton />
    </>
  );
};

export default Footer;
