import React from 'react';
export function Field({ label, placeholder, required = false, value, onChange, type: fieldType }) {
  const name = label === 'Nom complet' ? 'name' : label === 'Adresse e-mail' ? 'email' : label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const type = fieldType || (label === 'Adresse e-mail' ? 'email' : 'text')
  return <label className="field"><span>{label}</span><input name={name} type={type} placeholder={placeholder} required={required} value={value} onChange={onChange} /></label>
}
