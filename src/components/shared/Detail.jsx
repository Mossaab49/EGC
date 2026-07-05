import React from 'react';

export function Detail({ label, text }) {
  return <div className="detail"><small>{label}</small><span>{text}</span></div>
}
