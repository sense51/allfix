const currencyMap = {
  USD: { symbol: '$', code: 'USD' },
  EUR: { symbol: '\u20AC', code: 'EUR' },
  GBP: { symbol: '\u00A3', code: 'GBP' },
  JPY: { symbol: '\u00A5', code: 'JPY' },
  CAD: { symbol: 'CA$', code: 'CAD' },
  AUD: { symbol: 'A$', code: 'AUD' },
  INR: { symbol: '\u20B9', code: 'INR' },
  BRL: { symbol: 'R$', code: 'BRL' },
};

export const CURRENCIES = Object.values(currencyMap);

export function getCurrencySymbol(code) {
  return currencyMap[code]?.symbol || '$';
}

export function formatPrice(price, currencyCode) {
  const sym = getCurrencySymbol(currencyCode);
  return `${sym}${Number(price).toFixed(2)}`;
}
