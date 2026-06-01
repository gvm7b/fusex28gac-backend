import React from 'react';

export default function StatCard({ title, value, hint, icon, tone }) {
  return (
    <article className={`stat-card ${tone}`}>
      <div className="stat-icon">{icon}</div>
      <p>{title}</p>
      <h3>{value}</h3>
      <small>{hint}</small>
    </article>
  );
}
