export const CURRENCIES = [
  { code: "USD", label: "USD ($)", locale: "en-US" },
  { code: "INR", label: "INR (₹)", locale: "en-IN" },
];

const FORMATTERS = CURRENCIES.reduce((acc, currency) => {
  acc[currency.code] = new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
  });
  return acc;
}, {});

export function formatCurrency(value, currencyCode = "USD") {
  const formatter = FORMATTERS[currencyCode] || FORMATTERS.USD;
  return formatter.format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}
