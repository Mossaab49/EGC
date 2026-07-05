import React from 'react';
  
export function Toast({ toast }) {
  if (!toast) return null

  return (
    <div className="toast" role="status">
      <span className="toast-spark">*</span>
      <div><strong>{toast.title}</strong><p>{toast.copy}</p></div>
    </div>
  )
}
