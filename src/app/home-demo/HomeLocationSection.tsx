"use client";

import Image from "next/image";
import { MAJOR_CITIES, MINOR_CITIES, FILTERS } from "./homeLocationLinks";
import { hasListings, type ListingLinkCounts } from "../listings/listingLinkCounts";

interface Props {
  /** Server-fetched live count per link — a link whose page has no products is hidden. */
  linkCounts?: ListingLinkCounts;
}

export default function HomeLocationSection({ linkCounts }: Props) {
  const majorCities = MAJOR_CITIES.filter((c) => hasListings(linkCounts, c.href));
  const minorCities = MINOR_CITIES.filter((c) => hasListings(linkCounts, c.href));
  const filters = FILTERS
    .map((f) => ({ ...f, items: f.items.filter((i) => hasListings(linkCounts, i.href)) }))
    .filter((f) => f.items.length > 0);

  return (
    <section className="hloc-section">
      <div className="container">

        <div className="hloc-header">
          <h2 className="hloc-title">
            Find Camper Trailers for Sale by <span className="hloc-title-accent">Popular Location</span>
          </h2>
          <p className="hloc-subtitle">Browse camper trailers for sale near you by major Australian cities.</p>
          
        </div>

        <div className="hloc-major-grid">
          {majorCities.map((city) => (
            <a key={city.name} href={city.href} className="hloc-city-card">
              <div className="hloc-city-img-wrap">
                <div className="hloc-city-circle" />
                <Image
                  src={city.imgSrc}
                  alt={city.name}
                  width={110}
                  height={80}
                  className="hloc-city-img"
                  unoptimized
                />
              </div>
              <h3 className="hloc-city-name">
                {city.name} <span className="hloc-city-arrow"></span>
              </h3>
            </a>
          ))}
        </div>

        <div className="hloc-minor-wrap">
          {minorCities.map((city, idx) => (
            <a
              key={city.name}
              href={city.href}
              className={`hloc-minor-pill${idx === 0 ? " hloc-minor-pill--active" : ""}`}
            >
              <h3>{city.name}</h3>
            </a>
          ))}
        </div>
<div className="hloc-header">
  <h2 className="hloc-title">
           Search Camper Trailers for Sale <span className="hloc-title-accent">Your Way</span>
          </h2>
   
        </div>
        <div className="hloc-filters">
          
          {filters.map((f) => (
            <div key={f.label} className="hloc-filter-row">
              <div className="hloc-filter-label">
                <span className="hloc-filter-icon-box"><Image src={f.icon} alt={f.iconAlt} width={24} height={24} unoptimized /></span>
                <span className="hloc-filter-text">{f.label}</span>
              </div>
              <div className="hloc-filter-chips">
                <h3>
                {f.items.map((item,) => (

                  <a key={item.text} href={item.href} className="hloc-chip">
                   {item.text}</a>
                ))}
                </h3>
              </div>
            </div>
          ))}
        </div>
 
        

      </div>
    </section>
  );
}
