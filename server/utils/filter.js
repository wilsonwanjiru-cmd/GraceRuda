// server/utils/filter.js

/**
 * Check if text contains a Kenyan phone number pattern.
 * Matches:
 *   - +254XXXXXXXXX (e.g., +254703538670)
 *   - 254XXXXXXXXX  (e.g., 254703538670)
 * Removes spaces, hyphens, parentheses before checking.
 */
const containsPhoneNumber = (text) => {
  // Remove common separators
  const clean = text.replace(/[\s\-\(\)]/g, '');
  // Pattern: +254 or 254 followed by exactly 9 digits
  const pattern = /(\+254|254)\d{9}/;
  return pattern.test(clean);
};

module.exports = { containsPhoneNumber };