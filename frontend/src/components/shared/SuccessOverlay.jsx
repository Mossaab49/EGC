import { Button } from '../ui/Button.jsx'
import React from 'react';

export function SuccessOverlay({ success, close }) {
  if (!success) return null

  return <div className="success-overlay"><div className="success-card"><span className="confetti c1" /><span className="confetti c2" /><span className="confetti c3" /><span className="confetti c4" /><div className="success-symbol">OK</div><h2>{success.title}</h2><p>{success.copy}</p><div><Button onClick={() => { close(); success.action?.() }}>{success.actionLabel || 'Continuer'}</Button><Button variant="secondary" onClick={close}>Fermer</Button></div></div></div>
}
