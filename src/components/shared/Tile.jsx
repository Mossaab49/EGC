import React from 'react';

export function Tile({ value = '', status = '' }) {
  return <span className={`tile ${status}`}>{value}</span>
}
