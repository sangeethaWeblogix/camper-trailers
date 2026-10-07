import Image from "next/image";

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
                Camper Trailers for Sale Australia: <span className="hbg-title-accent">Buyer Guide</span>
              </h2>
              
              <p className="hbg-body">
                CampingTrailersForSale.com.au helps Australian buyers compare a wide range of camper trailers for sale in one convenient place. Browse affordable used camper trailers, premium new models and options designed for touring, family holidays or off-road adventures. Compare important features such as layout, ATM, tare weight, sleeping capacity, length, suspension, condition, service history and towing requirements to narrow down your choices before contacting a seller or visiting a dealership. Our easy-to-use platform makes researching and comparing camper trailers simple.
              </p>
              <p className="hbg-body">
                Explore popular camper trailer types including off-road, hybrid, pop top, touring and luxury camper trailers, while also comparing trusted camper trailer brands and reputable dealers across Australia. Check whether dealers offer warranty support, finance options, trade-ins, after-sales service and detailed vehicle information before making your decision. Use our buyers guide and convenient search filters to browse listings by state, location, budget, size, weight and berth, helping you find the right camper trailer for your lifestyle and travel plans.
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
