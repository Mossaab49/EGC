import React from 'react';

/**
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.placeholder
 * @param {boolean=} props.required
 * @param {string | number=} props.value
 * @param {React.ChangeEventHandler<HTMLInputElement>=} props.onChange
 * @param {React.HTMLInputTypeAttribute=} props.type
 * @param {string=} props.name
 */
export function Field({ label, placeholder, required = false, value, onChange, type: fieldType, name: inputName }) {
  const name = inputName || (label === 'Nom complet' ? 'name' : label === 'Adresse e-mail' ? 'email' : label.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
  const type = fieldType || (label === 'Adresse e-mail' ? 'email' : 'text')
  return <label className="field"><span>{label}</span><input name={name} type={type} placeholder={placeholder} required={required} value={value} onChange={onChange} /></label>
}
