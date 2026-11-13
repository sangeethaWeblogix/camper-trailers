import Image from "next/image";
import HomeFaqSection from "./HomeFaqSection";

export default function HomeBuyerGuide() {
  return (
    <>
      {/* ── Buyer Guide ── */}
      <section className="hbg-section">
        <div className="container">
          <div className="hbg-row">

            {/* Left: Image */}
            <div className="hbg-img-col">
              <div className="hbg-img-wrap">
                <Image
                  src="/images/buyers_guid.jpg"
                  alt="Camper Trailers for Sale Australia"
                  width={600}
                  height={420}
                  className="hbg-img"
                  unoptimized
                />
                <div className="hbg-badge">
                  <svg className="hbg-badge-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                  <span className="hbg-badge-text">AUSTRALIA&apos;S TRUSTED<br />CAMPER TRAILER MARKETPLACE</span>
                </div>
              </div>
            </div>

            {/* Right: Text */}
            <div className="hbg-text-col">
              <h2 className="hbg-title">
                Camper Trailers for Sale in Australia – <span className="hbg-title-accent">Buy with Confidence</span>
              </h2>

              <p className="hbg-body">
                Looking to buy a camper trailer in Australia? CampingTrailersForSale.com.au helps you browse and compare new and used camper trailers for sale from dealerships and private sellers nationwide. Whether you&apos;re buying your first camper trailer, upgrading your camping setup or searching for an affordable second-hand model, find one that suits your budget and travel plans.
              </p>
              <p className="hbg-body">
                Explore camper trailers from popular brands such as Jayco, Cub, MDC, OPUS, Patriot Campers, Black Series and Track Trailer. From compact teardrop campers and lightweight folding trailers to hard-floor, soft-floor, forward-fold, hybrid and off-road camper trailers, compare designs suited to weekend getaways, family camping and outback adventures.
              </p>
              <p className="hbg-body">
                Use our search filters to find camper trailers by location, price, condition, make, type, sleeping capacity, length and ATM. Compare important features such as suspension, ground clearance, slide-out kitchens, water storage, solar panels, battery systems, awnings and setup convenience.
              </p>
              <p className="hbg-body">
                When buying a used camper trailer, check its chassis, suspension, canvas, seals, folding mechanisms and overall condition. Whether you&apos;re planning short camping trips or extended travel around Australia,{" "}
                <a href="https://www.campingtrailersforsale.com.au/listings/" className="hbg-link">browse our camper trailer listings</a>, compare available listings and contact dealers or private sellers directly.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* ── Explore Other Travel Options ── */}
      <section className="hbg-explore-section">
        <div className="container">
          <h2 className="hbg-title">Explore Other Travel Options</h2>
          <p className="hbg-body">
            Still weighing up your options? Take a look at{" "}
            <a href="https://www.caravansforsale.com.au/" className="hbg-link" target="_blank" rel="noopener noreferrer">caravans for sale</a>{" "}
            if you&apos;d like more space and comfort, or browse{" "}
            <a href="https://www.motorhomesforsale.com.au/" className="hbg-link" target="_blank" rel="noopener noreferrer">motorhomes for sale</a>{" "}
            if you prefer to travel without towing. For something smaller, explore{" "}
            <a href="https://www.campervansforsale.au/" className="hbg-link" target="_blank" rel="noopener noreferrer">campervans for sale</a>.{" "}
            You&apos;ll find these on our other marketplaces.
          </p>
        </div>
      </section>

      <HomeFaqSection />

      {/* ── Sell CTA Card ── */}
      <section className="hbg-sell-section">
        <div className="container">
          <div className="hbg-sell-card">

            {/* Icon row */}
            <div className="hbg-sell-icon-row">
              <span className="hbg-sell-line" />
              <div className="hbg-sell-icon-wrap">
                <Image src="/images/category.svg" alt="" width={24} height={24} style={{ opacity: 0.4 }} />
              </div>
              <span className="hbg-sell-line" />
            </div>

            <h2 className="hbg-sell-title">Looking to Sell Your Camper Trailer?</h2>
            <p className="hbg-sell-body">
              If you&apos;re upgrading or no longer need your current camper trailer,{" "}
              <a href="/sell-my-camper-trailer/" className="hbg-sell-link">sell your camper trailer</a>{" "}
              by creating a listing on CampingTrailersForSale.com.au and connect with active buyers across Australia. Your advertisement stays online until it&apos;s sold for a one-time fee of $49.
            </p>


          </div>
        </div>
      </section>

      {/* ── Why Australians ── */}
      <section className="hbg-why-section">
        <div className="container">
          <h2 className="hbg-why-title">
            Why Australians Use <span className="hbg-why-accent">CampingTrailersForSale.com.au</span>
          </h2>
          

          <div className="hbg-why-cards-wrap">
            <div className="hbg-why-grid">

              <div className="hbg-why-card">
                <div className="hbg-why-icon">
                  <Image src="/images/seller.svg" alt="Dealers & Private Sellers" width={34} height={34} />
                </div>
                <h3 className="hbg-why-card-title">Dealers &amp; Private Sellers</h3>
                <div className="hbg-why-card-sep" />
                <p className="hbg-why-card-desc">Choose from a wide range of listings from trusted dealers and private sellers.</p>
              </div>

              <div className="hbg-why-card">
                <div className="hbg-why-icon">
                  <Image src="/images/australia.png" alt="Australia-Wide Coverage" width={34} height={34} />
                </div>
                <h3 className="hbg-why-card-title">Australia-Wide Coverage</h3>
                <div className="hbg-why-card-sep" />
                <p className="hbg-why-card-desc">Browse listings from all states and territories and find camper trailers near you.</p>
              </div>

              <div className="hbg-why-card">
                <div className="hbg-why-icon">
                  <Image src="/images/category.svg" alt="Camper Trailer-Specific Marketplace" width={34} height={34} />
                </div>
                <h3 className="hbg-why-card-title">Camper Trailer-Specific Marketplace</h3>
                <div className="hbg-why-card-sep" />
                <p className="hbg-why-card-desc">A focused marketplace dedicated to camper trailers and camper trailer buyers.</p>
              </div>

              <div className="hbg-why-card">
                <div className="hbg-why-icon">
                  <Image src="/images/dollar.png" alt="Easy to Compare" width={34} height={34} />
                </div>
                <h3 className="hbg-why-card-title">Easy to Compare</h3>
                <div className="hbg-why-card-sep" />
                <p className="hbg-why-card-desc">Compare prices, features and seller details side by side to find the best match.</p>
              </div>

            </div>
          </div>

          
        </div>
      </section>
    </>
  );
}
