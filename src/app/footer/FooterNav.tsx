"use client";

import { useState } from "react";

import { SELL_DATA } from "./footerLinks";

export default function FooterNav() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Nav row — panel is NOT inside this ul so it never breaks the flex row */}
      <ul className="footer_menu footer_xs">
        <li>
          <a href="/listings/">For Sale</a>
        </li>
        <li>
          <button
            className="sell-footer-btn"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="sell-links-panel"
          >
            Sell
            <svg
              className={`sell-chevron${open ? " sell-chevron--open" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </li>
        <li>
          <a href="/blog/">Blog</a>
        </li>
        <li>
          <a href="/terms-conditions/" rel="nofollow">Terms &amp; Conditions</a>
        </li>
        <li>
          <a href="/privacy-policy/" rel="nofollow">Privacy Policy</a>
        </li>
        <li>
          <a href="/privacy-collection-statement/" rel="nofollow">
            Privacy Collection Statement
          </a>
        </li>
        <li>
          <a href="/buyer-safety-guide/" rel="nofollow">Buy Safely</a>
        </li>
        <li>
          <a href="/cookie-policy/" rel="nofollow">Cookie Policy</a>
        </li>
        <li>
          <a href="/about-us/">About</a>
        </li>
        <li>
          <a href="/contact/">Contact Us</a>
        </li>
      </ul>

      {/* Panel sits outside the <ul> — opens below the nav row without pushing any links */}
      {open && (
        <div className="sell-panel" id="sell-links-panel">
          {/* Header */}
          <div className="sell-panel__header">
            <a href="/sell-my-camper-trailer/" className="sell-panel__main-link">
              Sell My Camper Trailer
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginLeft: 5, verticalAlign: "middle" }}
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <button
              className="sell-panel__close"
              onClick={() => setOpen(false)}
              aria-label="Close sell links"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* State + region grid */}
          <div className="sell-panel__grid">
            {SELL_DATA.map((s) => (
              <div key={s.stateSlug} className="sell-panel__col">
                <a
                  href={`/sell-my-camper-trailer/${s.stateSlug}/`}
                  className="sell-panel__state-title"
                >
                  Sell My Camper Trailer in {s.state}
                </a>
                <ul className="sell-panel__region-list">
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
  );
}
