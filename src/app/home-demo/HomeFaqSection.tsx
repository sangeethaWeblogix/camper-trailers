"use client";

import { useState } from "react";
import { FAQ_TABS } from "./faqData";

function renderAnswer(text: string) {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    const [, label, href] = match;
    const isExternal = /^https?:\/\//.test(href);
    return isExternal ? (
      <a key={i} href={href} className="hfaq-link" target="_blank" rel="noopener noreferrer">{label}</a>
    ) : (
      <a key={i} href={href} className="hfaq-link">{label}</a>
    );
  });
}

export default function HomeFaqSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const selectTab = (i: number) => {
    setActiveTab(i);
    setOpenIndex(0);
  };

  const activeItems = FAQ_TABS[activeTab].items;

  return (
    <section className="hfaq-section">
      <div className="container">
        <h2 className="hfaq-title">Frequently Asked Questions</h2>

        <div className="hfaq-tabs">
          {FAQ_TABS.map((tab, i) => (
            <button
              key={tab.label}
              className={`hfaq-tab${i === activeTab ? " hfaq-tab--active" : ""}`}
              onClick={() => selectTab(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hfaq-card">
          <div className="hfaq-card__header">
            <h3 className="hfaq-card__title">{FAQ_TABS[activeTab].label}</h3>
            <span className="hfaq-card__count">{activeItems.length} questions</span>
          </div>

          <div className="hfaq-list">
            {activeItems.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={item.q} className={`hfaq-item${isOpen ? " hfaq-item--open" : ""}`}>
                  <button
                    className="hfaq-item__question"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}`} />
                  </button>
                  {isOpen && <p className="hfaq-item__answer">{renderAnswer(item.a)}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
