/**
 * Lets JSX inline styles carry CSS custom properties while still returning a
 * React-compatible style object for checkJs.
 *
 * @param {Record<string, string | number>} vars
 * @returns {import('react').CSSProperties}
 */
export function cssVars(vars) {
  return /** @type {import('react').CSSProperties} */ (vars)
}
