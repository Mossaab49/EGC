import React from 'react';

export function PageHeader({ eyebrow, title, lead, children }) {
  return (
    <header className="page-header">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="section-title">{title}</h1>
        <p className="lead">{lead}</p>
        {children}
      </div>
    </header>
  )
}
