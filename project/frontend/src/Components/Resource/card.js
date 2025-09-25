import React, { useState } from "react";
import "./card.css"; 

export default function CardGridPage() {
  const initialItems = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    subtitle: "Interactive Demo",
    description:
      "This is a lightweight interactive card built with plain React, CSS transitions, and no external libraries.",
  }));

  const [items, setItems] = useState(initialItems);
  const [favorites, setFavorites] = useState(() => new Set());
  const [expanded, setExpanded] = useState(() => new Set());
  const [visibleCount, setVisibleCount] = useState(8); // Initial visible cards

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleExpanded = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addNewCard = () => {
    setItems((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: `Card ${prev.length + 1}`,
        subtitle: "Newly Added",
        description: "This card was dynamically added by clicking the plus button.",
      },
    ]);
  };

  const showMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, items.length));
  };

  const visibleItems = items.slice(0, visibleCount); // Slice the visible items

  return (
    <main className="page">
      <header className="header">
        <h1>Interactive Card Grid</h1>
        <p>4 per row · 3 rows · No external libraries</p>
      </header>

      <section className="grid" aria-label="Card Grid">
        {visibleItems.map((item) => (
          <article key={item.id} className="card" aria-labelledby={`title-${item.id}`}>
            <div className="media" aria-hidden="true">
              <div className="badge">{item.id}</div>
            </div>

            <div className="content">
              <h2 id={`title-${item.id}`} className="title">{item.title}</h2>
              <p className="subtitle">{item.subtitle}</p>
              <p className="desc">{item.description}</p>
            </div>

            <div className="actions">
              <button
                type="button"
                className={"btn like" + (favorites.has(item.id) ? " active" : "")}
                aria-pressed={favorites.has(item.id)}
                onClick={() => toggleFavorite(item.id)}
              >
                <HeartIcon filled={favorites.has(item.id)} />
                <span className="btn-text">{favorites.has(item.id) ? "Favorited" : "Favorite"}</span>
              </button>

              <button
                type="button"
                className="btn outline"
                aria-expanded={expanded.has(item.id)}
                aria-controls={`details-${item.id}`}
                onClick={() => toggleExpanded(item.id)}
              >
                {expanded.has(item.id) ? "Hide Details" : "Show Details"}
              </button>

              <button
                type="button"
                className="btn primary"
                onClick={() => window.alert(`You clicked ${item.title}`)}
              >
                Open
              </button>
            </div>

            <div
              id={`details-${item.id}`}
              className={"details" + (expanded.has(item.id) ? " open" : "")}
            >
              <ul>
                <li>Accessible: keyboard-focusable buttons with ARIA.</li>
                <li>Animated: subtle hover/press transitions.</li>
                <li>Stateful: favorite + expand states per card.</li>
              </ul>
            </div>
          </article>
        ))}

        {/* Add New Card */}
        <article key="add-card" className="card add-card">
          <button type="button" className="plus-btn" onClick={addNewCard} aria-label="Add new card">
            <svg className="icon" viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </article>
      </section>

      {/* See More Button */}
      {visibleCount < items.length && (
        <div className="see-more-container">
          <button className="btn primary see-more-btn" onClick={showMore}>
            See More
          </button>
        </div>
      )}

      <footer className="footer">
        <small>Built with React only — no external CSS/JS libraries.</small>
      </footer>
    </main>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M12 21s-6.716-4.244-9.428-7.2C-0.5 10.7 1.2 6.2 5.2 6.2c2.1 0 3.3 1.1 3.9 2 0.6-0.9 1.8-2 3.9-2 4 0 5.7 4.5 2.6 7.6C18.716 16.756 12 21 12 21z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}