import React from 'react';
export function Pill({ children, tone = 'blue', className = '' }) {
  return <span className={`pill ${tone} ${className}`}>{children}</span>
}
