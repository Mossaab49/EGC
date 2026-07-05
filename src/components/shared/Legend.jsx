import React from 'react';

export function Legend({ tone, text }) {
  return <div className="legend"><i className={tone} />{text}</div>
}
